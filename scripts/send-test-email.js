#!/usr/bin/env node

/**
 * Send a test email to verify SMTP configuration.
 * Usage: node scripts/send-test-email.js [recipient@example.com]
 *
 * Requires .env with SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, FROM_EMAIL
 */

'use strict';

require('dotenv').config();
const emailSender = require('../src/email-sender');

const recipient = process.argv[2] || process.env.SMTP_USER;

const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width">
  <style>
    body { font-family: Arial, sans-serif; max-width: 600px; margin: 40px auto; color: #333; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 24px; border-radius: 8px; text-align: center; }
    .body { padding: 24px; background: #f9f9f9; border-radius: 8px; margin-top: 16px; }
    .footer { text-align: center; font-size: 12px; color: #999; margin-top: 16px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Zenith Daily Brief</h1>
    <p>Test Email</p>
  </div>
  <div class="body">
    <p>This is a test email from <strong>Zenith</strong>.</p>
    <p>If you received this, your SMTP configuration is working correctly.</p>
    <ul>
      <li>Sent at: ${new Date().toLocaleString()}</li>
      <li>Recipient: ${recipient}</li>
      <li>SMTP Host: ${process.env.SMTP_HOST}</li>
    </ul>
    <p>You will receive the daily briefing at <strong>8:00 AM</strong> every morning.</p>
  </div>
  <footer class="footer">
    Zenith &mdash; Intelligent Daily Briefings
  </footer>
</body>
</html>
`;

async function main() {
  console.log(`Sending test email to: ${recipient}`);
  console.log(`SMTP: ${process.env.SMTP_USER}@${process.env.SMTP_HOST}:${process.env.SMTP_PORT}`);

  try {
    await emailSender.sendEmail(recipient, 'Zenith — Test Email', html);
    console.log('✓ Email sent successfully!');
  } catch (err) {
    console.error('✗ Failed to send email:', err.message);
    process.exit(1);
  }
}

main();
