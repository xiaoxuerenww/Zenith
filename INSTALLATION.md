# Installation Guide — Zenith Skills

## Prerequisites

- Claude environment (Claude.ai, Claude Code, or Cowork)
- Basic understanding of skill installation

## Installation Steps

### Option 1: Direct Installation (Easiest)

1. **Download the .skill files**
   - `daily-briefing.skill`
   - `llm-recommendations-paper-crawler.skill`

2. **Load into Claude**
   - In Claude, navigate to Skills settings
   - Upload the `.skill` files
   - Skills will be automatically installed

3. **Verify Installation**
   - Try triggering: `"Set up my daily briefing"`
   - If the skill responds with acknowledgment, installation successful

### Option 2: Manual Setup

If you prefer to set up skills manually:

1. **Create skill directories**
   ```
   ~/.claude/skills/
   ├── daily-briefing/
   └── llm-recommendations-paper-crawler/
   ```

2. **Copy files**
   - Copy `SKILL.md` to each directory
   - Copy `evals/` folder to each directory

3. **Reload Claude**
   - Restart your Claude environment
   - Skills will be automatically loaded

### Option 3: Git Clone

```bash
git clone https://github.com/YOUR_USERNAME/Zenith.git
cd Zenith

# Install daily-briefing skill
cp -r skills/daily-briefing ~/.claude/skills/

# Install paper-crawler skill
cp -r skills/paper-crawler ~/.claude/skills/

# Restart Claude
```

---

## Configuration

### Daily Briefing Configuration

After installation, customize by specifying:

**Default Domains:**
- Politics
- Technology
- Economics & Finance
- LLM + Recommendation Systems

**Customization Options:**
```
"Set up daily briefing with only tech and AI research"
"Give me 3 items per category instead of 5"
"Change my briefing time to 6 AM"
"Include health and science instead of politics"
```

### Paper Crawler Configuration

**Default Settings:**
- Search: ArXiv, Papers with Code, Google Scholar
- Domain: LLM × Recommendation Systems
- Items: Top 5 papers
- Time: Daily at 8 AM

**Customization:**
```
"Focus only on ArXiv papers"
"Increase to top 10 papers"
"Search for papers on neural networks instead"
"Run briefing at 9 AM instead of 8 AM"
```

---

## Troubleshooting

### Skill Not Appearing

**Problem:** Installed skill doesn't show up in Claude

**Solution:**
1. Verify file structure is correct
2. Ensure SKILL.md is in root of skill directory
3. Check for syntax errors in SKILL.md
4. Restart Claude completely
5. Clear cache if available

### Scheduling Not Working

**Problem:** Daily scheduling not triggering

**Solution:**
1. Verify your system time is correct
2. Check if Claude process is running
3. Ensure system allows background scheduling
4. Try on-demand trigger first to test skill works
5. Contact support if issue persists

### Links Not Working

**Problem:** Article links or paper links are broken

**Solution:**
- This is expected in example outputs
- Live skill execution uses web search to find real URLs
- Links will be current when skill runs daily
- You can manually update examples if desired

### Performance Issues

**Problem:** Skill taking too long to run

**Solution:**
1. Check your internet connection
2. Verify news sources are accessible
3. Try with fewer categories initially (3 instead of 4)
4. Check system resources/memory

---

## Advanced Configuration

### Custom Categories

To modify domains for daily briefing:

1. Edit `SKILL.md` in the daily-briefing directory
2. Modify the "Content Discovery by Category" section
3. Update the test cases in `evals/evals.json`
4. Save and reload

### Custom Paper Sources

To add/remove paper sources:

1. Edit `SKILL.md` in paper-crawler directory
2. Modify the "Content Discovery" section
3. Update search strategy as needed
4. Test with eval prompts

### Output Format

Both skills support customization:
- HTML (visual, interactive)
- Word document (.docx)
- JSON (programmatic)
- Markdown (clean text)

Specify your preferred format when setting up.

---

## System Requirements

**Minimum:**
- Claude access (free or premium)
- Internet connection
- 50 MB disk space for skill files

**Recommended:**
- Premium Claude for faster responses
- Stable internet for reliable scheduling
- 100 MB disk space for examples and logs

---

## First-Time Setup Checklist

- [ ] Downloaded both .skill files
- [ ] Installed skills in Claude
- [ ] Verified skills appear in settings
- [ ] Tested daily-briefing trigger
- [ ] Tested paper-crawler trigger
- [ ] Set up scheduling (optional)
- [ ] Customized domains (optional)
- [ ] Read USAGE.md for full features

---

## Getting Help

**Can't get something working?**

1. Check the [FAQ.md](docs/FAQ.md)
2. Review [USAGE.md](USAGE.md)
3. Check the examples in `examples/` folder
4. Open an issue on GitHub with:
   - What you're trying to do
   - What happened instead
   - Your system/Claude version
   - Any error messages

---

## Next Steps

After installation:
1. Read [USAGE.md](USAGE.md) to learn how to trigger skills
2. Check [FEATURES.md](docs/FEATURES.md) for complete feature list
3. Review examples in `examples/` folder
4. Set up your preferred trigger phrases
5. Configure scheduling or run on-demand

---

**Installation Complete!** 🎉

Your Zenith skills are ready to help you focus on what matters.
