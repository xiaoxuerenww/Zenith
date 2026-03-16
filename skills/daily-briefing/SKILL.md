---
name: daily-briefing
description: |
  Create a comprehensive daily briefing that aggregates the top news, updates, and research from multiple key domains: Politics, Technology, Economics/Finance, and LLM x Recommendation Systems. Automatically curates the most important stories and papers every morning at 8 AM, providing brief summaries with sources and links in a single professional Word document. Use this skill whenever the user wants to: set up a daily news digest, create an automated briefing across multiple domains, establish a morning update routine, schedule a comprehensive daily summary, or aggregate current events from specific domains. Can also run on-demand for immediate updates without waiting for the scheduled time.
compatibility: |
  - Web search capabilities for news aggregation
  - News source access (Reuters, BBC, AP, CNBC, etc.)
  - Academic paper sources (ArXiv, Google Scholar)
  - Document generation (.docx)
  - Optional: Scheduled task runner (for daily 8 AM execution)
---

# Daily Multi-Category Briefing

## Overview

This skill creates an automated daily briefing that keeps you informed across four critical domains: Politics, Technology, Economics/Finance, and LLM x Recommendation Systems. Every morning at 8 AM, it sources the top stories and research from each domain and delivers them in a single, comprehensive Word document.

**Key capabilities:**
- Search multiple news and research sources
- Curate top 5 items per category (20 total per brief)
- Brief, accessible summaries (2-3 sentences each)
- Professional Word document output with consistent formatting
- Scheduled daily execution (8 AM) or on-demand execution
- Balanced coverage across all four domains

## How It Works

### 1. Content Discovery by Category

For each category, search the appropriate sources:

#### Politics (News sources)
- Reuters, BBC, AP News, NPR, The Guardian
- Focus: Major political developments, elections, policy changes, international relations
- Recency: Within the last 24 hours, prioritize breaking news

#### Technology (News + tech publications)
- TechCrunch, The Verge, Ars Technica, WSJ Tech section, Bloomberg Tech
- Focus: New product launches, funding announcements, industry trends, AI developments
- Recency: Within the last 24 hours

#### Economics/Finance (Financial news)
- CNBC, Bloomberg, Financial Times, The Economist, MarketWatch
- Focus: Market movements, economic data, earnings reports, policy impacts on markets
- Recency: Within the last 24 hours, prioritize market-moving events

#### LLM x Recommendation Systems (Academic papers)
- ArXiv, Papers with Code, Google Scholar
- Focus: Research at the intersection of LLMs and recommendation systems
- Recency: Within the last 2 weeks, prioritize recent preprints and published papers

### 2. Selection & Ranking

For each category, select the **top 5 items** based on:
- **Relevance**: How directly does it fit the category?
- **Importance**: Is it a significant development or marginal news?
- **Recency**: Newer stories/papers rank higher
- **Reach/Impact**: Consider how widely this affects the domain or audience

**Tiebreaker rule**: If multiple stories have equal importance, prefer the most recent one.

### 3. Brief Generation

For each of the 20 items (5 per category), compile:
- **Title** (exact title from source)
- **Source** (news outlet name or ArXiv, Papers with Code, etc.)
- **Publication Date** (Month day, year format: e.g., March 14, 2026)
- **Summary**: 2-3 sentences explaining what happened and why it matters
- **URL/Link**: Direct link to the story or paper
- **Importance Level**: Classify as "Critical" (immediate action/market impact), "High" (significant development), "Medium" (noteworthy but not urgent), or "Emerging" (developing story)
- **Sentiment**: Mark as "Positive" (bullish/good news), "Negative" (bearish/concerning), or "Neutral" (informational)
- **Impact Score**: Rate 1-10 based on potential ripple effects across the industry/market/field

Keep summaries concise but informative. Assume the audience is educated but may not be deeply familiar with every domain.

### 4. Word Document Output

Create a professional .docx document with this structure:

**Header/Title**: "Daily Briefing" + current date (e.g., "Daily Briefing — March 15, 2026")

**Intro section**: A 1-2 sentence statement explaining what's in the brief, e.g., "Your curated summary of today's top stories in Politics, Technology, Economics, and LLM Research."

**For each category**, format as:

```
## [Category Name]

**[#1] [Title]**
Source: [Source Name] | Date: Month DD, YYYY
[2-3 sentence summary explaining what this is and why it matters]
Link: [URL]

**[#2] [Title]**
Source: [Source Name] | Date: Month DD, YYYY
[2-3 sentence summary]
Link: [URL]

**[#3] [Title]**
Source: [Source Name] | Date: Month DD, YYYY
[2-3 sentence summary]
Link: [URL]
```

- Use consistent formatting (category names as H2 headings, bold titles, consistent spacing)
- Include timestamp at the very top: "Generated: YYYY-MM-DD at HH:MM AM/PM"
- Save with filename: `Daily_Briefing_YYYY-MM-DD.docx`

## Execution Modes

### Scheduled Daily Execution
- **When**: 8 AM local time every day
- **Output**: Word document saved to user's designated output folder
- **Notification**: Inform user that the daily briefing is ready

### On-Demand Execution
- Trigger immediately when the user requests an update
- Same output format and quality as scheduled runs
- Useful for catching breaking news between scheduled runs

## Selection Quality Standards

Before finalizing the brief:
1. Verify all 20 items are unique (no duplicates across or within categories)
2. Check that each summary is 2-3 sentences, not longer
3. Confirm all links are working and point to legitimate sources
4. Ensure categories are well-balanced (5 per category)
5. Verify publication dates make sense (news should be same day or previous day, papers within 2 weeks)
6. Quality check: Does each item genuinely belong in a "top" briefing? (No trivial or marginal news)
7. Analytics accuracy: Verify importance levels, sentiment ratings, and impact scores are consistent and calibrated
8. Ensure impact scores reflect potential ripple effects (not just immediate news relevance)

## Error Handling

- **If fewer than 3 items found in a category**: Return as many as available with an explanation (e.g., "Limited news today, found 2 relevant stories")
- **If a source/link is unavailable**: Note it but include the story if it's important
- **If news source is temporarily down**: Gracefully degrade and use alternative sources
- **If no papers found in LLM+Recs**: Create a note explaining the search coverage that day

## Content Guidelines

### Politics
- Major elections, policy changes, international conflicts, significant political appointments
- Exclude: Routine procedural votes, minor local politics (unless nationally significant)

### Technology
- New product releases, major funding rounds, significant technical breakthroughs, regulatory developments, M&A, industry trends
- Exclude: Minor product updates, routine corporate announcements

### Economics/Finance
- Earnings surprises, economic data releases (GDP, employment, inflation), major market movements, central bank decisions, significant mergers, consumer trends
- Exclude: Minor stock fluctuations, routine corporate earnings

### LLM x Recommendation Systems
- Papers advancing the field, novel applications combining both domains, benchmarks, surveys, papers with significant citations or implementations
- Exclude: Pure LLM papers without recommendation angle, pure recommendation papers without LLM angle

## Notes

- **Timeliness matters**: News items should reflect what's happening today/yesterday. Academic papers can be up to 2 weeks old.
- **Accessibility**: Summaries should be accessible to educated generalists, not specialists. Avoid excessive jargon.
- **Balance**: Try to include a mix of positive and challenging news—don't skew toward sensationalism.
- **Sources**: Prefer reputable, established sources. Avoid opinion columns or highly speculative coverage unless it's from a thought leader with significant influence.
