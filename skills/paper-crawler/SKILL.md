---
name: llm-recommendations-paper-crawler
description: |
  Crawl and curate the latest academic papers in the LLM (Large Language Models) x Recommendation Systems intersection domain. Automatically discovers top papers daily at 8 AM by searching multiple sources (ArXiv, Papers with Code, Google Scholar), ranks them by a combination of recency and relevance, and delivers a curated brief of the top 5 papers as a Word document. Use this skill whenever the user asks to: set up a daily paper digest/brief in the LLM+Recommendations domain, create an automated research update task, schedule a morning research brief, or crawl papers and summarize findings. Can also be triggered on-demand for immediate paper updates without waiting for the scheduled time.
compatibility: |
  - Web search/fetch capabilities for paper sources
  - Document generation (.docx)
  - Optional: Scheduled task runner (for daily 8 AM execution)
---

# LLM x Recommendations Daily Paper Crawler

## Overview

This skill automatically discovers, curates, and summarizes the most relevant papers at the intersection of Large Language Models and Recommendation Systems. Every morning at 8 AM, it crawls multiple academic sources, identifies the top 5 papers based on relevance and recency, and delivers a formatted brief as a Word document.

**Key capabilities:**
- Search across multiple paper sources (ArXiv, Papers with Code, Google Scholar)
- Intelligent ranking combining publication recency + relevance to the domain
- Minimal but informative summaries (1-2 sentences per paper)
- Professional Word document output with consistent formatting
- Scheduled daily execution (8 AM) or on-demand execution

## How It Works

### 1. Paper Discovery & Collection

Search the following sources for papers matching the LLM x Recommendation Systems domain:

- **ArXiv**: Search with keywords like "recommendation system", "LLM", "large language model", "collaborative filtering", "neural recommendation"
- **Papers with Code**: Filter for papers with implementations in the LLM or recommendation systems categories
- **Google Scholar**: Supplement with recent highly-cited papers in the domain
- Focus on papers from the **last 2-4 weeks** to balance freshness with relevance

**Search strategy**: Use compound queries like:
- "large language model recommendation"
- "LLM recommendation system"
- "transformer recommendation"
- "neural recommendation collaborative filtering"

### 2. Relevance Scoring

For each paper found, assign a relevance score (0-100) based on:
- **Title match**: Does the title directly mention LLM, recommendation, or related terms? (0-30 points)
- **Abstract relevance**: How central is the paper to LLM+Recs intersection? (0-40 points)
- **Recency bonus**: More recent papers score higher (0-30 points, with papers from this week getting max points)

**Selection rule**: Select the top 5 papers by combined score. If there's a tie, prefer more recent papers.

### 3. Brief Generation

For each of the top 5 papers, extract and compile:
- **Title** (exact)
- **Authors** (first 3-4 authors, then "et al." if more)
- **Publication date** (day/month/year when available)
- **Abstract excerpt** OR 1-2 sentence summary explaining what the paper does and why it matters for LLM+Recs
- **URL/link** to the paper (ArXiv link, Papers with Code link, or source URL)

Keep the summary concise and accessible—assume a technical audience familiar with ML but maybe not this specific subfield.

### 4. Word Document Output

Create a professional .docx document with:

**Header/Title**: "LLM × Recommendation Systems: Top 5 Papers" + current date

**Format for each paper**:
```
[#1] Title of Paper
Authors: Author1, Author2, et al.
Date: DD Month YYYY
Summary: 1-2 sentence summary...
Link: [URL]
Relevance Score: XX/100
```

- Use consistent formatting (heading styles, spacing, bold for titles)
- Include a timestamp at the top ("Generated: YYYY-MM-DD at HH:MM AM/PM")
- Add a brief intro line explaining the selection criteria (e.g., "Selected based on publication date and domain relevance")
- Save with filename: `LLM_Recommendations_Brief_YYYY-MM-DD.docx`

## Execution Modes

### Scheduled Daily Execution
- **When**: 8 AM local time every day
- **Output**: Word document saved to user's designated output folder
- **Notification**: Inform the user that the daily brief is ready (optional: email, file location, etc.)

### On-Demand Execution
- Trigger immediately when the user requests a paper update
- Same output format and quality as scheduled runs
- Useful for catching papers published between scheduled runs

## Quality Checks

Before finalizing the brief:
1. Verify all 5 papers are unique (no duplicates)
2. Confirm relevance scores make sense (papers should cluster 60-100 range)
3. Check that at least 3 of the 5 papers are from the last 2 weeks
4. Validate all links are working and point to actual papers
5. Ensure summaries are 1-2 sentences, not longer

## Error Handling

- If fewer than 5 relevant papers found: Return as many as available (don't force low-relevance papers in to hit 5)
- If a paper link breaks: Note it as "[Source unavailable]" but include the paper
- If search service is down: Gracefully degrade and inform the user which source couldn't be accessed
- If no papers found: Create a brief explaining search coverage that day

## Notes

- **Relevance is flexible**: The LLM x Recommendation Systems domain is broad—include papers on LLMs applied to recs, recommendation systems using transformers, papers on efficient retrieval for recs with LLMs, etc.
- **Domain examples**: Papers might cover topics like: LLM-based ranking, prompt-based recommendation, retrieval-augmented recommendation, sequential recommendation with LLMs, cross-domain recommendation with language models, etc.
- **Avoid**: Pure LLM papers with no recommendation angle, and pure recommendation papers with no LLM angle. The paper should meaningfully span both domains.
