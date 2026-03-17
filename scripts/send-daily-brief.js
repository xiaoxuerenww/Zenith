#!/usr/bin/env node

/**
 * Send today's daily briefing to all subscribers in data/subscribers.txt
 * Usage: node scripts/send-daily-brief.js
 */

'use strict';

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const emailSender = require('../src/email-sender');

const SUBSCRIBERS_FILE = path.join(__dirname, '../data/subscribers.txt');
const BRIEFING_HTML    = path.join(__dirname, '../examples/daily_briefing_with_analytics.html');

const date = new Date().toLocaleDateString('en-US', {
  year: 'numeric', month: 'long', day: 'numeric',
});
const subject = `Zenith Daily Brief — ${date}`;

async function main() {
  // Load subscribers from file
  console.log(`Loading subscribers from ${SUBSCRIBERS_FILE}...`);
  const { subscribed, skipped, invalid } = emailSender.subscribeFromFile(SUBSCRIBERS_FILE);
  if (subscribed.length) console.log(`  + Subscribed: ${subscribed.join(', ')}`);
  if (skipped.length)    console.log(`  ~ Already active: ${skipped.join(', ')}`);
  if (invalid.length)    console.log(`  ! Invalid (skipped): ${invalid.join(', ')}`);

  const subscribers = emailSender.getSubscriptions();
  console.log(`\nSending "${subject}" to ${subscribers.length} subscriber(s)...`);

  // Load briefing HTML
  const html = fs.readFileSync(BRIEFING_HTML, 'utf8');

  // Send
  const result = await emailSender.sendDailyBriefing(html, subject);
  console.log(`✓ Sent:   ${result.sent}`);
  console.log(`✗ Failed: ${result.failed}`);
  if (result.errors.length) {
    result.errors.forEach(e => console.log(`  - ${e.email}: ${e.error}`));
  }
}

main().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
