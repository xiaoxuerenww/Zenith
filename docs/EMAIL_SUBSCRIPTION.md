# Email Subscription Feature — Zenith

## Overview

Allow users to receive their daily Zenith briefing via email at 8 AM instead of (or in addition to) accessing it directly in Claude.

---

## Feature Proposal

### What Users Get

✅ Daily email delivery at 8 AM
✅ HTML formatted briefing in inbox
✅ Clickable links to full articles/papers
✅ Impact & Sentiment analytics displayed
✅ Beautiful email template
✅ Easy subscription management

### How It Works

1. **User subscribes:** "Set up email delivery for my daily briefing"
2. **Confirmation:** Email verification link sent
3. **Daily delivery:** 8 AM email with latest briefing
4. **Easy unsubscribe:** Link at bottom of each email

---

## User Setup

### Subscribing to Email

```
"Subscribe me to daily email briefings"
"Send my briefing to my email every morning"
"Email me the daily briefing at 8 AM"
```

### Email Management

```
"Add my work email to the subscription"
"Change my email to [newemail@example.com]"
"Unsubscribe from email briefings"
"Send me emails at 7 AM instead of 8 AM"
"Email me both briefings (daily + papers)"
```

---

## Email Template Example

```html
┌─────────────────────────────────────┐
│           ZENITH DAILY              │
│         Intelligence Brief          │
│      March 16, 2026 at 8:00 AM      │
└─────────────────────────────────────┘

Your curated summary of the top 20 stories
across Politics, Technology, Economics,
and LLM Research.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 POLITICS (5 items)

[1] Iran Conflict Escalates...
Source: Reuters | Date: March 16, 2026
Importance: CRITICAL | Sentiment: ⬇️ Negative | Impact: 9/10

[2] Republican Deepfake Videos...
...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💻 TECHNOLOGY (5 items)

[1] NVIDIA Showcases AI Dominance...
...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 ECONOMICS & FINANCE (5 items)

...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 LLM + RECOMMENDATIONS (5 items)

...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Manage Subscription] [View in Browser]
[Unsubscribe]

© 2026 Zenith | Helping you focus on what matters
```

---

## Implementation Approach

### Backend Requirements

**Option 1: Cloud-Based (Full Service)**
- Email service integration (SendGrid, Mailgun, AWS SES)
- Database for subscriptions
- Scheduled jobs for 8 AM delivery
- User management dashboard
- Unsubscribe handling

**Option 2: Manual/Lightweight**
- Google Sheets + Zapier for automation
- Existing email service (Gmail)
- Simple form for subscriptions
- Manual or templated delivery

**Option 3: Claude-Integrated**
- Use Claude API for trigger
- Schedule briefing generation
- Send via user's own email service
- Minimal infrastructure needed

### Recommendation: Option 3 (Claude-Integrated)

**Why:**
- No external infrastructure needed
- Uses existing Claude scheduling
- User controls their own email
- Privacy-friendly approach
- Easy to implement and maintain

---

## Implementation Steps

### Phase 1: Email Generation (Week 1)

Update Zenith to generate email-formatted output:

```markdown
SKILL.md modifications:
- Add "email_format" output option
- Create HTML template for email
- Include styling and formatting
- Add unsubscribe instructions
```

### Phase 2: Scheduling Integration (Week 2)

Integrate with Claude's scheduled task system:

```
Task: Daily briefing email at 8 AM
Frequency: Daily
Time: 8:00 AM
Action: Generate briefing, format as email, send
Recipient: User's email address
```

### Phase 3: Subscription Management (Week 3)

Add subscription management:

```
"Subscribe me to emails: [your@email.com]"
"Unsubscribe: [your@email.com]"
"Change email to: [newemail@email.com]"
"Email time change: [new time]"
```

---

## User Experience Flow

### Subscribe

```
User: "Subscribe me to daily email briefings"

Claude: "I'd be happy to set up email delivery!

         What email should I send to?
         (example: yourname@gmail.com)"

User: "aaron@example.com"

Claude: "Perfect! I've set up daily briefing emails
         for aaron@example.com at 8 AM.

         You'll receive your first email tomorrow morning.

         To unsubscribe or change settings, just ask!"
```

### First Email

```
Subject: Zenith Daily Brief — March 17, 2026

[Beautiful HTML email with 20 items across 4 domains]

---
[Manage] [Unsubscribe]
```

### Manage Subscription

```
User: "Change my email to newemail@example.com"

Claude: "I'll update your subscription to newemail@example.com.

         You'll receive tomorrow's briefing at the new address.

         (Confirmation: newemail@example.com)"
```

---

## Features by Phase

### MVP (Minimum Viable Product)

✅ Email format output
✅ Daily scheduling
✅ One email address per user
✅ Unsubscribe link
✅ Simple management

### Phase 2

✅ Multiple email addresses
✅ Time customization (not just 8 AM)
✅ Category selection per email
✅ Frequency options (daily, weekly)
✅ Analytics via email

### Phase 3

✅ Email digest aggregation
✅ Reply-to-email features
✅ Email preferences dashboard
✅ GDPR compliance
✅ Email templates customization

---

## Technical Considerations

### Email Format

Use **MJML** (Mailjet Markup Language) for responsive emails:

```mjml
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-text font-size="20px" align="center">
          Zenith Daily Brief
        </mj-text>

        <mj-divider/>

        <mj-text>
          Your curated briefing...
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
```

### Email Service Integration

**SendGrid Example:**
```python
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

def send_briefing_email(to_email, briefing_html):
    message = Mail(
        from_email='briefing@zenith.ai',
        to_emails=to_email,
        subject=f'Zenith Daily Brief — {date}',
        html_content=briefing_html
    )
    sg = SendGridAPIClient('SENDGRID_API_KEY')
    sg.send(message)
```

### Subscription Database Schema

```json
{
  "subscriptions": [
    {
      "id": "sub_123",
      "email": "user@example.com",
      "created_date": "2026-03-16",
      "send_time": "08:00",
      "frequency": "daily",
      "domains": ["politics", "tech", "economics", "llm"],
      "status": "active",
      "unsubscribe_token": "token_xyz"
    }
  ]
}
```

---

## Privacy & Compliance

### GDPR Compliance
- ✅ Explicit consent required
- ✅ Easy unsubscribe mechanism
- ✅ Data deletion on request
- ✅ Privacy policy included

### Best Practices
- Include unsubscribe link in every email
- Never share email list
- Transparent about data usage
- Regular privacy audits

### Email Template Footer

```
---
This is your Zenith Daily Brief.

[Manage Preferences] | [Unsubscribe]

Privacy | Terms | Contact

© 2026 Zenith — Focus on What Matters
```

---

## Success Metrics

### KPIs to Track

- **Subscription rate:** % of users who subscribe to email
- **Open rate:** % of emails opened
- **Click rate:** % of links clicked
- **Unsubscribe rate:** % who unsubscribe (should be <5%)
- **Engagement:** Which sections get most clicks

### Goals

- **Month 1:** 50% of active users subscribed
- **Month 2:** 70% subscription rate
- **Month 3:** 75% open rate, <2% unsubscribe

---

## Implementation Roadmap

**Week 1-2:** Email formatting & template
**Week 2-3:** Scheduling integration
**Week 3-4:** Subscription management
**Week 4-5:** Testing & optimization
**Week 5-6:** Beta launch
**Week 6+:** Full production

---

## Future Enhancements

- **AI-powered subject lines:** "3 critical developments you need to know"
- **Personalization:** Learn preferences, auto-highlight relevant items
- **Digest modes:** Weekly, bi-weekly options
- **Custom scheduling:** Different times for different days
- **Mobile app integration:** In-app notifications + email
- **Reply-to feature:** React/comment on items via email reply
- **Integration:** IFTTT, Zapier, etc.

---

## User Communication

### Announcement

```
🎉 NEW: Email Delivery for Zenith Briefings!

Stay informed without leaving your inbox.

Get your daily briefing emailed to you at 8 AM:
- 20 curated items across 4 domains
- Impact & Sentiment analytics
- Direct links to full stories
- Beautiful HTML formatting

Subscribe: "Email my daily briefing to [email@example.com]"

Manage: "Change my email" | "Unsubscribe"

Try it today! 📧
```

---

## FAQ

**Q: Can I get both email and Claude access?**
A: Yes! Use the skill in Claude AND get daily emails.

**Q: How do I unsubscribe?**
A: Click the unsubscribe link in any email, or say "unsubscribe me from emails"

**Q: Can I change the email time?**
A: Yes! "Send my email at 9 AM instead" or any time you prefer.

**Q: Is my email private?**
A: Absolutely. We never share or sell email addresses.

**Q: Can I get emails for just certain domains?**
A: Future feature! Coming in Phase 2.

---

## Getting Started

To implement email subscriptions:

1. **Decision:** Choose implementation approach (Option 3 recommended)
2. **Design:** Finalize email template
3. **Development:** Integrate with sending service
4. **Testing:** Test subscription workflow
5. **Launch:** Begin with opt-in beta
6. **Promote:** Let users know about feature

---

**Email subscriptions are coming to Zenith!** 🚀

Help users stay informed by bringing briefings directly to their inbox.
