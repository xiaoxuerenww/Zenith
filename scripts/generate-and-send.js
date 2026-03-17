'use strict';

/**
 * generate-and-send.js
 *
 * Uses the Claude API with web search to run the daily-briefing skill,
 * generates a real HTML briefing from live news, and emails it to all subscribers.
 *
 * Usage: node scripts/generate-and-send.js
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const Anthropic = require('@anthropic-ai/sdk');
const emailSender = require('../src/email-sender');

const SKILL = fs.readFileSync(
  path.join(__dirname, '../skills/daily-briefing/SKILL.md'),
  'utf8',
);

const now = new Date();
const windowStart = new Date(now.getTime() - 24 * 60 * 60 * 1000);

const TODAY = now.toLocaleDateString('en-US', {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
});

const WINDOW = `${windowStart.toLocaleString('en-US', {
  month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true,
})} – ${now.toLocaleString('en-US', {
  month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true,
})}`;

const SYSTEM_PROMPT = `${SKILL}

You are running the daily briefing skill. Today is ${TODAY}.

IMPORTANT OUTPUT FORMAT:
- Return ONLY a complete HTML email document — no markdown, no explanation, no preamble.
- Use the exact same HTML/inline-style format as specified: single column, max-width 640px, table-based layout, all styles inline.
- Each story must have: number, linked title, analytics badges (except LLM Research section), source · date, 2-3 sentence summary, "Why it matters:" line in blue italic.
- LLM Research section: NO analytics badges. Use https://arxiv.org/html/{id} links.
- Include a footer with unsubscribe placeholder: {{UNSUBSCRIBE_TOKEN}}
- Start the response with <!DOCTYPE html> and nothing before it.`;

const USER_PROMPT = `Search for the top stories published in the 24-hour window: ${WINDOW}.

Only include stories published within this exact window. Do not include older stories.

Search each category:
1. Politics — top 5 stories from Reuters, BBC, AP, NPR, The Guardian
2. Technology — top 5 from TechCrunch, The Verge, Ars Technica, Bloomberg Tech
3. Economics/Finance — top 5 from Bloomberg, CNBC, FT, MarketWatch
4. LLM x Recommendation Systems — top 5 papers from ArXiv (last 2 weeks)

Generate the daily briefing HTML email for ${TODAY}. Return only the complete HTML email. No commentary before or after.`;

async function run() {
  const client = new Anthropic.default({ apiKey: process.env.CLAUDE_API_KEY });

  console.log(`Generating daily briefing for ${TODAY}...`);
  console.log('Searching for live news via Claude + web search...\n');

  const stream = client.messages.stream({
    model: 'claude-opus-4-6',
    max_tokens: 16000,
    thinking: { type: 'adaptive' },
    system: SYSTEM_PROMPT,
    tools: [
      { type: 'web_search_20260209', name: 'web_search' },
    ],
    messages: [{ role: 'user', content: USER_PROMPT }],
  });

  // Show progress dots while generating
  process.stdout.write('Generating');
  stream.on('message', () => {});
  stream.on('text', () => process.stdout.write('.'));

  const message = await stream.finalMessage();
  console.log('\n');

  // Extract the HTML from the response
  let html = '';
  for (const block of message.content) {
    if (block.type === 'text') {
      html += block.text;
    }
  }

  // Trim anything before <!DOCTYPE
  const doctypeIdx = html.indexOf('<!DOCTYPE');
  if (doctypeIdx > 0) html = html.slice(doctypeIdx);

  if (!html.includes('<html')) {
    console.error('Error: Claude did not return valid HTML. Response:\n', html.slice(0, 500));
    process.exit(1);
  }

  // Save the generated HTML for reference
  const outputPath = path.join(__dirname, '../examples/daily_briefing_with_analytics.html');
  fs.writeFileSync(outputPath, html);
  console.log(`Briefing saved to: examples/daily_briefing_with_analytics.html`);

  // Send to all subscribers
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const subject = `Zenith Daily Brief — ${date}`;

  // Load subscribers from file first
  const subscribersFile = path.join(__dirname, '../data/subscribers.txt');
  if (fs.existsSync(subscribersFile)) {
    emailSender.subscribeFromFile(subscribersFile);
  }

  const subscribers = emailSender.getSubscriptions();
  console.log(`\nSending "${subject}" to ${subscribers.length} subscriber(s)...`);

  const result = await emailSender.sendDailyBriefing(html, subject);
  console.log(`✓ Sent:   ${result.sent}`);
  console.log(`✗ Failed: ${result.failed}`);
  if (result.errors.length) {
    result.errors.forEach(e => console.log(`  - ${e.email}: ${e.error}`));
  }
}

run().catch(err => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
