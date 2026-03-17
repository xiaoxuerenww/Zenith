'use strict';

require('dotenv').config();
const express = require('express');
const emailSender = require('./src/email-sender');

const app = express();
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

app.use(express.urlencoded({ extended: false }));

// ---------------------------------------------------------------------------
// GET /subscribe — signup form
// ---------------------------------------------------------------------------
app.get('/subscribe', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Subscribe — Zenith Daily Brief</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
           background: #f4f4f4; margin: 0; padding: 40px 16px; color: #1a1a1a; }
    .card { background: white; max-width: 440px; margin: 0 auto;
            border-radius: 10px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,.08); }
    .header { background: linear-gradient(135deg,#667eea,#764ba2);
              padding: 28px 32px; color: white; }
    .header h1 { margin: 0; font-size: 22px; }
    .header p  { margin: 6px 0 0; font-size: 13px; opacity: .85; }
    .body { padding: 28px 32px; }
    label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; }
    input[type=email] { width: 100%; padding: 10px 12px; border: 1px solid #ddd;
                        border-radius: 6px; font-size: 14px; outline: none; }
    input[type=email]:focus { border-color: #667eea; }
    button { margin-top: 14px; width: 100%; padding: 11px;
             background: linear-gradient(135deg,#667eea,#764ba2);
             color: white; border: none; border-radius: 6px;
             font-size: 14px; font-weight: 600; cursor: pointer; }
    .note { font-size: 11px; color: #999; margin-top: 12px; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>Zenith Daily Brief</h1>
      <p>Curated intelligence across Politics, Tech, Economics &amp; LLM Research — delivered every morning.</p>
    </div>
    <div class="body">
      <form method="POST" action="/subscribe">
        <label for="email">Your email address</label>
        <input type="email" id="email" name="email" placeholder="you@example.com" required autofocus>
        <button type="submit">Subscribe</button>
      </form>
      <p class="note">Free. One email per day. Unsubscribe anytime.</p>
    </div>
  </div>
</body>
</html>`);
});

// ---------------------------------------------------------------------------
// POST /subscribe — handle form submission
// ---------------------------------------------------------------------------
app.post('/subscribe', async (req, res) => {
  const email = (req.body.email || '').trim().toLowerCase();

  if (!email || !email.includes('@')) {
    return res.status(400).send(page('Invalid email', 'Please enter a valid email address.', '#e53e3e'));
  }

  try {
    const sub = emailSender.subscribe(email);
    const isNew = sub.createdAt && (Date.now() - new Date(sub.createdAt).getTime()) < 5000;

    // Send confirmation email (non-blocking — don't fail subscription if SMTP is down)
    sendConfirmation(email, sub.unsubscribeToken).catch(() => {});

    const msg = isNew
      ? `You're subscribed! Check your inbox for a confirmation.`
      : `You're already subscribed with ${email}.`;
    res.send(page('Subscribed!', msg, '#38a169'));
  } catch (err) {
    res.status(500).send(page('Error', err.message, '#e53e3e'));
  }
});

// ---------------------------------------------------------------------------
// GET /unsubscribe?token=... — one-click unsubscribe
// ---------------------------------------------------------------------------
app.get('/unsubscribe', (req, res) => {
  const token = req.query.token || '';
  const ok = emailSender.unsubscribe(token);

  if (ok) {
    res.send(page('Unsubscribed', "You've been removed from Zenith Daily Brief. Sorry to see you go!", '#718096'));
  } else {
    res.status(404).send(page('Link expired', 'This unsubscribe link is invalid or already used.', '#e53e3e'));
  }
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function sendConfirmation(email, unsubscribeToken) {
  const unsubscribeUrl = `${BASE_URL}/unsubscribe?token=${unsubscribeToken}`;
  const html = `<!DOCTYPE html>
<html><body style="font-family:-apple-system,sans-serif;max-width:520px;margin:32px auto;padding:0 16px;color:#1a1a1a;">
  <div style="background:linear-gradient(135deg,#667eea,#764ba2);padding:20px 24px;border-radius:8px 8px 0 0;">
    <h1 style="margin:0;font-size:20px;color:white;">Welcome to Zenith!</h1>
  </div>
  <div style="background:white;border:1px solid #ddd;border-top:none;padding:24px;border-radius:0 0 8px 8px;">
    <p>You're subscribed to <strong>Zenith Daily Brief</strong>.</p>
    <p>Every morning at 7 AM you'll receive a curated digest of the top stories in Politics, Technology, Economics, and LLM Research.</p>
    <p style="font-size:12px;color:#999;margin-top:24px;">
      Don't want these emails? <a href="${unsubscribeUrl}" style="color:#667eea;">Unsubscribe</a>
    </p>
  </div>
</body></html>`;
  await emailSender.sendEmail(email, 'Welcome to Zenith Daily Brief', html);
}

function page(title, message, color) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — Zenith</title>
  <style>
    body { font-family: -apple-system, sans-serif; background: #f4f4f4;
           margin: 0; padding: 40px 16px; text-align: center; }
    .card { background: white; max-width: 400px; margin: 0 auto;
            border-radius: 10px; padding: 36px 32px;
            box-shadow: 0 2px 12px rgba(0,0,0,.08); }
    .icon { font-size: 40px; margin-bottom: 12px; }
    h2 { margin: 0 0 10px; color: ${color}; }
    p  { color: #555; font-size: 14px; margin: 0 0 20px; }
    a  { color: #667eea; font-size: 13px; }
  </style>
</head>
<body>
  <div class="card">
    <h2>${title}</h2>
    <p>${message}</p>
    <a href="/subscribe">← Back to subscribe page</a>
  </div>
</body>
</html>`;
}

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`Zenith subscription server running at ${BASE_URL}`);
  console.log(`  Subscribe:   ${BASE_URL}/subscribe`);
  console.log(`  Unsubscribe: ${BASE_URL}/unsubscribe?token=<token>`);
});
