# Email Subscription Implementation Guide — Zenith

## Complete Technical Implementation

This guide provides step-by-step instructions for adding email delivery to Zenith briefings.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────┐
│         User Requests Daily Briefing             │
│    "Email my briefing to me@example.com"         │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│      Claude Processes Request                    │
│  - Stores subscription in database               │
│  - Generates briefing content                    │
│  - Formats as HTML email                         │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│    Daily Scheduled Task (8 AM)                   │
│  - Fetches subscriptions from database           │
│  - Generates fresh briefing for each            │
│  - Sends via email service                       │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│      User Receives Email at 8 AM                 │
│  - Beautiful HTML formatted briefing             │
│  - Clickable links to stories/papers             │
│  - Manage/Unsubscribe links                      │
└─────────────────────────────────────────────────┘
```

---

## Step 1: Update SKILL.md

Add email functionality to both skills.

### Daily Briefing Modifications

**Add to "Key capabilities" section:**

```markdown
- Email subscription available
- Set custom send time (default 8 AM)
- Beautiful HTML email template
- One-click unsubscribe
```

**Add new section before "Execution Modes":**

```markdown
## Email Delivery

Users can subscribe to receive daily briefings via email:

- **Subscription:** "Email my briefing to me@example.com"
- **Management:** "Change email to..." or "Unsubscribe me from emails"
- **Customization:** "Send emails at 9 AM" or "Email only tech news"
- **Format:** Professional HTML with analytics displayed
- **Privacy:** No data sharing, easy unsubscribe

Email includes:
- All 20 curated items with full analytics
- Direct links to source articles
- Branded header/footer
- One-click unsubscribe link
```

### Paper Crawler Modifications

**Add similar section with:**

```markdown
## Email Delivery

Subscribe to receive top 5 papers via email daily.

- **Subscription:** "Email me the latest LLM papers"
- **Timing:** Daily at your preferred time
- **Format:** Formatted email with paper links
- **Unsubscribe:** One-click in every email
```

---

## Step 2: Subscription Database Schema

**Create a subscriptions table:**

```json
{
  "subscriptions": [
    {
      "id": "sub_abc123xyz",
      "skill_type": "daily-briefing",
      "email": "user@example.com",
      "created_date": "2026-03-16T14:30:00Z",
      "send_time": "08:00",
      "send_timezone": "America/Los_Angeles",
      "frequency": "daily",
      "domains": [
        "politics",
        "technology",
        "economics",
        "llm-research"
      ],
      "status": "active",
      "unsubscribe_token": "token_xyz_unsubscribe_key",
      "last_sent": "2026-03-16T08:00:00Z",
      "next_send": "2026-03-17T08:00:00Z",
      "preferences": {
        "include_analytics": true,
        "html_format": true,
        "include_links": true
      }
    }
  ]
}
```

---

## Step 3: Email Template (HTML)

**Professional email template:**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .container {
            background: #fff;
            border-radius: 8px;
            padding: 30px;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            margin-bottom: 30px;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
        }
        .timestamp {
            font-size: 14px;
            opacity: 0.9;
        }
        .category-section {
            margin-bottom: 30px;
        }
        .category-title {
            color: #667eea;
            font-size: 20px;
            font-weight: 700;
            border-bottom: 2px solid #667eea;
            padding-bottom: 10px;
            margin-bottom: 15px;
        }
        .story-item {
            margin-bottom: 20px;
            padding-bottom: 20px;
            border-bottom: 1px solid #eee;
        }
        .story-item:last-child {
            border-bottom: none;
        }
        .story-title {
            font-size: 16px;
            font-weight: 700;
            color: #212529;
            margin-bottom: 8px;
        }
        .story-meta {
            font-size: 13px;
            color: #666;
            margin-bottom: 10px;
        }
        .story-summary {
            font-size: 14px;
            line-height: 1.6;
            color: #495057;
            margin-bottom: 10px;
        }
        .analytics {
            display: flex;
            gap: 10px;
            margin-bottom: 10px;
            font-size: 12px;
        }
        .analytics-badge {
            background: #f0f0f0;
            padding: 5px 10px;
            border-radius: 4px;
            font-weight: 600;
        }
        .importance-critical { color: #dc3545; }
        .importance-high { color: #fd7e14; }
        .importance-medium { color: #17a2b8; }
        .sentiment-positive { color: #28a745; }
        .sentiment-negative { color: #dc3545; }
        .story-link {
            color: #667eea;
            text-decoration: none;
            font-weight: 600;
        }
        .story-link:hover {
            text-decoration: underline;
        }
        .footer {
            border-top: 1px solid #eee;
            padding-top: 20px;
            margin-top: 30px;
            font-size: 12px;
            color: #666;
            text-align: center;
        }
        .manage-links {
            text-align: center;
            margin: 20px 0;
        }
        .manage-links a {
            color: #667eea;
            text-decoration: none;
            margin: 0 15px;
            font-size: 13px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📰 Zenith Daily Brief</h1>
            <div class="timestamp">March 16, 2026 • 8:00 AM</div>
        </div>

        <p>Your curated summary of today's top stories and research across Politics, Technology, Economics, and LLM Research.</p>

        <!-- POLITICS SECTION -->
        <div class="category-section">
            <div class="category-title">🏛️ Politics</div>
            <div class="story-item">
                <div class="story-title">Iran Conflict Escalates with Death of Supreme Leader</div>
                <div class="story-meta">Source: Reuters | Date: March 16, 2026</div>
                <div class="story-summary">President Trump's administration and Israel launched strikes that killed Iran's Supreme Leader. The strike has triggered significant global market volatility.</div>
                <div class="analytics">
                    <span class="analytics-badge importance-critical">CRITICAL</span>
                    <span class="analytics-badge sentiment-negative">Negative</span>
                    <span class="analytics-badge">Impact: 9/10</span>
                </div>
                <a href="https://www.cnn.com/..." class="story-link">Read full story →</a>
            </div>

            <!-- Additional stories... -->
        </div>

        <!-- TECHNOLOGY SECTION -->
        <div class="category-section">
            <div class="category-title">💻 Technology</div>
            <!-- Stories... -->
        </div>

        <!-- ECONOMICS SECTION -->
        <div class="category-section">
            <div class="category-title">📊 Economics & Finance</div>
            <!-- Stories... -->
        </div>

        <!-- LLM + RESEARCH SECTION -->
        <div class="category-section">
            <div class="category-title">📚 LLM + Recommendations Research</div>
            <!-- Papers... -->
        </div>

        <div class="manage-links">
            <a href="https://zenith.ai/unsubscribe?token={{UNSUBSCRIBE_TOKEN}}">Unsubscribe</a>
            |
            <a href="https://zenith.ai/preferences?token={{SUBSCRIPTION_ID}}">Manage Preferences</a>
            |
            <a href="https://zenith.ai/view-online?id={{EMAIL_ID}}">View in Browser</a>
        </div>

        <div class="footer">
            <p>© 2026 Zenith | Help people focus on what matters</p>
            <p>You're receiving this because you subscribed to Zenith Daily Briefing</p>
        </div>
    </div>
</body>
</html>
```

---

## Step 4: Subscription Management Triggers

**Add these trigger phrases to SKILL.md:**

```markdown
### Email Subscription Commands

**Subscribe:**
- "Email me my daily briefing"
- "Subscribe me to emails at [email@example.com]"
- "Send briefing to my inbox every morning"
- "Setup email delivery for daily briefing"

**Manage:**
- "Change my email to [newemail@example.com]"
- "Send my emails at 7 AM instead of 8 AM"
- "Email me only tech and AI news"
- "Include/exclude [domain] in my emails"

**Unsubscribe:**
- "Unsubscribe me from email briefings"
- "Stop sending me emails"
- "Remove my email: [email@example.com]"
```

---

## Step 5: Backend Implementation

### Option A: Node.js + SendGrid

```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Subscribe user
async function subscribeUser(email, preferences) {
  const subscription = {
    id: generateId(),
    email: email,
    created_date: new Date(),
    send_time: preferences.time || '08:00',
    status: 'active',
    unsubscribe_token: generateToken()
  };

  // Save to database
  await db.subscriptions.insert(subscription);

  // Send confirmation email
  await sgMail.send({
    to: email,
    from: 'briefing@zenith.ai',
    subject: 'Confirm your Zenith subscription',
    html: confirmationEmailTemplate(subscription.unsubscribe_token)
  });
}

// Send daily briefing
async function sendDailyBriefing(briefingContent) {
  const subscriptions = await db.subscriptions.find({ status: 'active' });

  for (const sub of subscriptions) {
    const emailContent = generateEmailHTML(briefingContent, sub.preferences);

    await sgMail.send({
      to: sub.email,
      from: 'briefing@zenith.ai',
      subject: `Zenith Daily Brief — ${new Date().toLocaleDateString()}`,
      html: emailContent,
      trackingSettings: {
        clickTracking: { enable: true },
        openTracking: { enable: true }
      }
    });
  }
}

// Unsubscribe
async function unsubscribeUser(token) {
  await db.subscriptions.update(
    { unsubscribe_token: token },
    { status: 'unsubscribed' }
  );
}
```

### Option B: Python + AWS SES

```python
import boto3
from datetime import datetime

ses_client = boto3.client('ses', region_name='us-east-1')

def subscribe_user(email, preferences):
    subscription = {
        'id': generate_id(),
        'email': email,
        'created_date': datetime.now(),
        'send_time': preferences.get('time', '08:00'),
        'status': 'active',
        'unsubscribe_token': generate_token()
    }

    # Save to DynamoDB
    table.put_item(Item=subscription)

    # Send confirmation
    send_email(
        to=email,
        subject='Confirm your Zenith subscription',
        body=confirmation_template(subscription['unsubscribe_token'])
    )

def send_daily_briefing(briefing_content):
    subscriptions = table.scan()['Items']

    for sub in subscriptions:
        if sub['status'] != 'active':
            continue

        email_html = generate_email_html(briefing_content, sub['preferences'])

        ses_client.send_email(
            Source='briefing@zenith.ai',
            Destination={'ToAddresses': [sub['email']]},
            Message={
                'Subject': {'Data': f"Zenith Daily Brief — {datetime.now().strftime('%B %d, %Y')}"},
                'Body': {'Html': {'Data': email_html}}
            }
        )

def unsubscribe_user(token):
    table.update_item(
        Key={'unsubscribe_token': token},
        UpdateExpression='SET #status = :status',
        ExpressionAttributeNames={'#status': 'status'},
        ExpressionAttributeValues={':status': 'unsubscribed'}
    )
```

### Option C: Claude-Integrated (Recommended)

```markdown
# Using Claude's Native Scheduling

## Setup:

1. User subscribes: "Email me my daily briefing"

2. Claude creates scheduled task:
   - Task name: "zenith-daily-briefing-[userid]"
   - Schedule: Daily at 8 AM
   - Action: Generate briefing, send via email

3. At 8 AM daily:
   - Briefing automatically generated
   - Formatted as HTML email
   - Sent to user's email via SMTP
   - Unsubscribe link included

## Implementation:

- Use Claude's built-in scheduling
- User provides email address
- System sends via configured SMTP
- Database tracks subscriptions
- Unsubscribe via token link
```

---

## Step 6: Unsubscribe Page

**Create simple unsubscribe confirmation:**

```html
<!DOCTYPE html>
<html>
<head>
    <title>Unsubscribe from Zenith</title>
</head>
<body>
    <h1>Unsubscribe from Zenith Daily Brief</h1>

    <p>You have been unsubscribed from Zenith daily briefing emails.</p>

    <p>We'll miss you! But you can always:</p>
    <ul>
        <li>Use Zenith directly in Claude without emails</li>
        <li>Resubscribe anytime by saying "Email me again"</li>
    </ul>

    <p><a href="https://zenith.ai">Visit Zenith →</a></p>
</body>
</html>
```

---

## Step 7: Testing Checklist

- [ ] User can subscribe with email
- [ ] Confirmation email sent immediately
- [ ] Briefing generated at scheduled time
- [ ] Email renders correctly in Gmail, Outlook, Apple Mail
- [ ] All links work (articles, unsubscribe, preferences)
- [ ] Analytics display correctly in email
- [ ] Unsubscribe link works
- [ ] Unsubscribed users don't receive emails
- [ ] Users can change preferences
- [ ] Multiple subscriptions work (same person, different emails)
- [ ] Email metadata correct (from, subject, date)
- [ ] HTML mobile responsive

---

## Step 8: Monitoring & Analytics

**Track these metrics:**

```json
{
  "email_metrics": {
    "total_subscribers": 150,
    "active_subscribers": 142,
    "unsubscribe_rate": 0.8,
    "email_sent_today": 142,
    "send_failures": 0,
    "open_rate": 0.68,
    "click_rate": 0.34,
    "bounce_rate": 0.02,
    "complaint_rate": 0.001
  }
}
```

---

## Step 9: Privacy & Compliance

### GDPR Compliance

**In every email include:**
```
[Manage Preferences] [Unsubscribe] [Privacy Policy]
```

**Privacy policy should state:**
- What data is collected
- How long it's retained
- User rights to access/delete
- No third-party sharing

### CAN-SPAM Compliance

**Required in every email:**
- Clear sender identification
- Valid unsubscribe mechanism
- Response within 10 business days
- Physical business address

---

## Step 10: Scaling Considerations

### For 1,000+ subscribers:

**Batch processing:**
```python
def send_batch_emails(subscriber_batch_size=100):
    subscriptions = get_active_subscriptions()

    for i in range(0, len(subscriptions), subscriber_batch_size):
        batch = subscriptions[i:i+subscriber_batch_size]

        # Parallel processing
        for sub in batch:
            send_email_async(sub)

        # Rate limiting
        time.sleep(1)
```

**Queue system:**
- Use message queue (RabbitMQ, SQS)
- Distribute email sending across workers
- Implement retry logic
- Monitor delivery status

---

## Step 11: User Communication

### Announcement in SKILL.md

```
🎉 NEW: Email Delivery for Zenith Briefings!

Get your daily briefing delivered to your inbox at 8 AM:

"Email my briefing to me@example.com"

Features:
✅ Beautiful HTML formatting
✅ Full analytics included
✅ Direct links to all stories
✅ One-click unsubscribe
✅ Privacy-first design

Try it today! 📧
```

---

## Phase 2: Advanced Features

**Consider adding:**

```
1. Weekly digest emails (instead of daily)
2. Multiple email addresses per user
3. Category-specific emails
4. Email preference dashboard
5. Digest frequency options
6. Time zone customization
7. Reply-to-comment feature
8. Email analytics dashboard
```

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Emails go to spam | Implement SPF/DKIM/DMARC, improve sender reputation |
| High unsubscribe rate | Review email frequency, improve content relevance |
| Low open rate | Test subject lines, optimize send time |
| Broken links | Validate all URLs before sending, use link tracking |
| Slow delivery | Implement batch queuing, use reliable ESP |

---

## Summary

**To implement email subscriptions:**

1. Update SKILL.md with email triggers
2. Create subscription database schema
3. Design email template (use provided HTML)
4. Choose backend option (Node/Python/Claude-native)
5. Implement subscription/unsubscribe functions
6. Add email sending at scheduled time
7. Create unsubscribe confirmation page
8. Test thoroughly across email clients
9. Monitor delivery metrics
10. Ensure GDPR/CAN-SPAM compliance
11. Announce feature to users
12. Gather feedback and iterate

**Estimated development time:** 1-2 weeks
**Cost:** Free (if using Claude-native) to $20-50/month (for 1000+ subscribers with commercial ESP)

---

**Email subscriptions = increased user engagement and retention!** 📧
