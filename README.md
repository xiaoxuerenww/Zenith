# Zenith

**Help people focus their limited attention on what truly matters.**

Zenith is an automated daily briefing system that filters information noise to surface the most important developments across Politics, Technology, Economics, and LLM Research — delivered to your inbox every morning.

---

## Features

- **20 curated stories daily** — 5 per category, ranked by importance and recency
- **Analytics badges** — Importance level, sentiment, and impact score per story
- **"Why it matters"** — A concise line explaining relevance for every item
- **2-column HTML email** — Dense, scannable layout optimized for Gmail
- **ArXiv links** — All papers link to readable `/html/` format
- **Email delivery** — SMTP-based, subscriber list from a plain text file
- **Scheduled sends** — Daily at 7 AM (configurable)
- **8/8 tests passing**

---

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure SMTP

```bash
cp .env.example .env
# Edit .env and fill in your Gmail + App Password
```

To generate a Gmail App Password: [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)

### 3. Add subscribers

```bash
# data/subscribers.txt — one email per line, # for comments
you@example.com
```

### 4. Send the daily brief

```bash
node scripts/send-daily-brief.js
```

### 5. Send a test email

```bash
node scripts/send-test-email.js you@example.com
```

---

## Project Structure

```
Zenith/
├── src/
│   └── email-sender.js          # Subscribe, unsubscribe, send
├── scripts/
│   ├── send-daily-brief.js      # Send to all active subscribers
│   └── send-test-email.js       # One-off test send
├── skills/
│   └── daily-briefing/
│       └── SKILL.md             # Briefing generation spec
├── examples/
│   └── daily_briefing_with_analytics.html  # HTML email template
├── tests/
│   └── test-daily-briefing.js   # Test suite (8/8)
├── data/
│   └── subscribers.txt          # Subscriber list (gitignored)
├── .env.example                 # Config template
└── TODO.md                      # Roadmap
```

---

## Email API

```js
const email = require('./src/email-sender');

email.subscribe('user@example.com');
email.subscribeFromFile('./data/subscribers.txt');
email.unsubscribe('user@example.com');
email.getSubscriptions();           // returns all subscribers
email.sendDailyBriefing(htmlContent, subject);
email.sendEmail(to, subject, html); // one-off send
```

---

## Configuration

`.env` variables:

| Variable | Description |
|---|---|
| `SMTP_HOST` | SMTP server (default: `smtp.gmail.com`) |
| `SMTP_PORT` | SMTP port (default: `587`) |
| `SMTP_USER` | Your Gmail address |
| `SMTP_PASSWORD` | Gmail App Password (not your account password) |
| `FROM_EMAIL` | Sender address shown in emails |

---

## Running Tests

```bash
npm run test:daily-briefing
```

---

## Roadmap

See [TODO.md](TODO.md) for planned features including live news fetching, cron scheduling, unsubscribe links, and more.

---

## Security

- Never commit `.env` — it is gitignored
- Use a Gmail **App Password**, not your account password
- `data/subscribers.txt` and `data/subscriptions.json` are gitignored

---

## License

MIT
