# Key Learnings — Building Zenith

A personal log of lessons learned while building this automated daily briefing system.

---

## Email Delivery

### Gmail CSS support is very limited
CSS Grid and Flexbox are stripped by Gmail. The only reliable 2-column layout is HTML `<table>` with `width="50%"` on each `<td>`. All styles must be inline — no `<head>` stylesheets.

### Never put real credentials in .env.example
Committed a real Gmail App Password to `.env.example` by mistake. Lesson: `.env.example` is for placeholder values only. Real secrets go in `.env`, which is gitignored. Revoke and rotate any credential that touches a public repo immediately.

### Resend sandbox limits who you can email
Without a verified domain, Resend only allows sending to the account owner's email. To send to anyone, verify a domain at resend.com/domains. Gmail App Passwords are an alternative but require 2FA and are account-specific.

### Subscriber data is personal data — gitignore it
`data/subscribers.txt` and `data/subscriptions.json` contain real email addresses and should never be committed. Added both to `.gitignore` after the initial mistake.

---

## Scheduling

### Claude Code session crons are not persistent
`CronCreate` jobs live only in the active Claude Code session — they disappear on restart. For production reliability, use a system cron job (`crontab -e`) or a hosted scheduler. Session crons are good for testing and short-lived automation.

### Account for job duration when scheduling
The briefing generation takes ~10 minutes (Claude API + web search). Schedule the job 10 minutes before the desired delivery time so emails arrive on schedule.

### Use an explicit time window in the news prompt
Prompting Claude with "last 24 hours" is ambiguous. Passing the exact window (`Mar 16 2:48 PM – Mar 17 2:48 PM`) as a string in the prompt produces more consistent, correctly-scoped results.

---

## Claude API

### API credits are account-specific
The `CLAUDE_API_KEY` is tied to a specific Anthropic account. Adding credits to a different account won't fix a `credit balance too low` error — verify the key matches the account you topped up.

### Adaptive thinking + web search produces high-quality briefings
Using `thinking: { type: 'adaptive' }` with the `web_search_20260209` tool gives Claude the ability to reason about what to search, search multiple times, and synthesize results into a coherent output. The quality is significantly better than a single-shot prompt.

### Skills are just well-structured prompts
A Claude skill (SKILL.md) is a detailed system prompt — nothing more. The quality of the output depends entirely on how precisely the skill defines the expected format, selection criteria, and edge cases.

---

## Project Architecture

### Separation of concerns matters even in small projects
Keeping email logic (`src/email-sender.js`), generation logic (`scripts/generate-and-send.js`), and the web server (`server.js`) separate made it easy to swap Resend in for SMTP without touching the briefing generation code.

### Static HTML templates become stale quickly
The initial approach of editing a static HTML file worked for demos but broke as soon as the date changed. Real automation requires generating content programmatically on each run.

### Skill zip packaging
Claude skills must have `SKILL.md` at the top level of the zip — not nested in subdirectories. The source code can keep it in `skills/daily-briefing/SKILL.md` for organization, but the distributable zip must copy it to root.

---

## General

### Verify domain before going live
Email deliverability is non-trivial. Custom domains with Resend (or any ESP) dramatically improve inbox placement vs. shared sender domains like `onboarding@resend.dev`.

### Commit often, push to remote early
Lost work when the session compacted. Committing intermediate states and pushing to GitHub meant nothing was permanently lost.
