/**
 * Zenith Email Sender
 * Manages subscriptions and sends daily briefings via SMTP (nodemailer).
 *
 * Subscriptions are persisted to data/subscriptions.json.
 * Configure SMTP via environment variables (see .env.example).
 */

'use strict';

const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const SUBSCRIPTIONS_FILE = path.join(__dirname, '../data/subscriptions.json');

// ---------------------------------------------------------------------------
// Subscription storage (JSON file)
// ---------------------------------------------------------------------------

function loadSubscriptions() {
  if (!fs.existsSync(SUBSCRIPTIONS_FILE)) return [];
  return JSON.parse(fs.readFileSync(SUBSCRIPTIONS_FILE, 'utf8'));
}

function saveSubscriptions(subscriptions) {
  const dir = path.dirname(SUBSCRIPTIONS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(SUBSCRIPTIONS_FILE, JSON.stringify(subscriptions, null, 2));
}

// ---------------------------------------------------------------------------
// Subscription management
// ---------------------------------------------------------------------------

/**
 * Subscribe an email address.
 * @param {string} email
 * @param {object} [preferences]
 * @param {string} [preferences.sendTime='08:00']
 * @returns {{ id: string, email: string, unsubscribeToken: string }}
 */
function subscribe(email, preferences = {}) {
  if (!email || !email.includes('@')) throw new Error(`Invalid email: ${email}`);

  const subscriptions = loadSubscriptions();
  const existing = subscriptions.find(s => s.email === email && s.status === 'active');
  if (existing) return existing;

  const subscription = {
    id: crypto.randomUUID(),
    email,
    sendTime: preferences.sendTime || '08:00',
    status: 'active',
    unsubscribeToken: crypto.randomBytes(32).toString('hex'),
    createdAt: new Date().toISOString(),
  };

  subscriptions.push(subscription);
  saveSubscriptions(subscriptions);
  return subscription;
}

/**
 * Unsubscribe using the token from a subscription record.
 * @param {string} token
 * @returns {boolean} true if a subscription was deactivated
 */
function unsubscribe(token) {
  const subscriptions = loadSubscriptions();
  const sub = subscriptions.find(s => s.unsubscribeToken === token);
  if (!sub) return false;

  sub.status = 'unsubscribed';
  saveSubscriptions(subscriptions);
  return true;
}

/**
 * Return all active subscriptions.
 * @returns {Array}
 */
function getSubscriptions() {
  return loadSubscriptions().filter(s => s.status === 'active');
}

/**
 * Subscribe all emails listed in a file (one email per line).
 * Blank lines and lines starting with # are ignored.
 * @param {string} filePath  Path to the email list file
 * @param {object} [preferences]
 * @returns {{ subscribed: string[], skipped: string[], invalid: string[] }}
 */
function subscribeFromFile(filePath, preferences = {}) {
  if (!fs.existsSync(filePath)) throw new Error(`File not found: ${filePath}`);

  const lines = fs.readFileSync(filePath, 'utf8').split('\n');
  const subscribed = [];
  const skipped = [];
  const invalid = [];

  for (const raw of lines) {
    const email = raw.trim();
    if (!email || email.startsWith('#')) continue;

    if (!email.includes('@')) {
      invalid.push(email);
      continue;
    }

    const existing = loadSubscriptions().find(s => s.email === email && s.status === 'active');
    if (existing) {
      skipped.push(email);
      continue;
    }

    subscribe(email, preferences);
    subscribed.push(email);
  }

  return { subscribed, skipped, invalid };
}

// ---------------------------------------------------------------------------
// SMTP transport (nodemailer)
// ---------------------------------------------------------------------------

function createTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
}

// ---------------------------------------------------------------------------
// Email sending
// ---------------------------------------------------------------------------

/**
 * Send the daily briefing HTML to all active subscribers.
 * @param {string} htmlContent  Fully rendered HTML email body
 * @param {string} [subject]    Email subject (defaults to dated briefing title)
 * @returns {Promise<{ sent: number, failed: number, errors: Array }>}
 */
async function sendDailyBriefing(htmlContent, subject) {
  const subscribers = getSubscriptions();
  if (subscribers.length === 0) return { sent: 0, failed: 0, errors: [] };

  const transport = createTransport();
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
  const emailSubject = subject || `Zenith Daily Brief — ${date}`;
  const fromAddress = process.env.FROM_EMAIL || process.env.SMTP_USER;

  let sent = 0;
  let failed = 0;
  const errors = [];

  for (const sub of subscribers) {
    const personalizedHtml = htmlContent.replace(
      /{{UNSUBSCRIBE_TOKEN}}/g,
      sub.unsubscribeToken,
    );

    try {
      await transport.sendMail({
        from: fromAddress,
        to: sub.email,
        subject: emailSubject,
        html: personalizedHtml,
      });
      sent++;
    } catch (err) {
      failed++;
      errors.push({ email: sub.email, error: err.message });
    }
  }

  return { sent, failed, errors };
}

/**
 * Send a single email (e.g., subscription confirmation).
 * @param {string} to
 * @param {string} subject
 * @param {string} html
 */
async function sendEmail(to, subject, html) {
  const transport = createTransport();
  await transport.sendMail({
    from: process.env.FROM_EMAIL || process.env.SMTP_USER,
    to,
    subject,
    html,
  });
}

module.exports = {
  subscribe,
  subscribeFromFile,
  unsubscribe,
  getSubscriptions,
  sendDailyBriefing,
  sendEmail,
};
