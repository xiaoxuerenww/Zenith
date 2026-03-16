# Quick Start Development Guide — Zenith in VS Code

Get up and running with Zenith development in 5 minutes.

---

## 1. Setup (2 minutes)

### Clone/Download Zenith

```bash
# Navigate to your projects directory
cd ~/projects

# Download Zenith
git clone https://github.com/YOUR_USERNAME/Zenith.git
cd Zenith
```

### Install Dependencies

```bash
# Install Node.js dependencies
npm install

# Create .env file
cp .env.example .env

# (Optional: Add API keys to .env if needed)
```

---

## 2. Open in VS Code (1 minute)

```bash
# Open project in VS Code
code .
```

**In VS Code:**
1. Open integrated terminal: ``Ctrl + ` ``
2. You're ready to go!

---

## 3. Run Tests

### Test Daily Briefing

**Option A: Single Run**
```bash
npm run test:daily-briefing
```

**Option B: Watch Mode (Auto-reload on file changes)**
```bash
npm run dev:daily-briefing
```

**In VS Code Debug:**
1. Press `F5`
2. Select "Test Daily Briefing" or "Watch Daily Briefing"
3. Tests run in integrated terminal

### Test Paper Crawler

**Single Run:**
```bash
npm run test:paper-crawler
```

**Watch Mode:**
```bash
npm run dev:paper-crawler
```

---

## 4. Quick Iteration Workflow

### Scenario: Update Daily Briefing Logic

```
1. Edit: skills/daily-briefing/SKILL.md
   ↓
2. Terminal: npm run dev:daily-briefing (auto-runs on save)
   ↓
3. See results immediately
   ↓
4. Fix any issues
   ↓
5. Tests pass ✅
```

### Scenario: Test Email Integration

```
1. Edit: tests/test-daily-briefing.js (modify email formatting)
   ↓
2. Save file
   ↓
3. Watch mode auto-runs tests
   ↓
4. See email HTML output in terminal
   ↓
5. Iterate quickly
```

---

## 5. Key Files to Edit

### Core Skills

```
skills/daily-briefing/
├── SKILL.md           ← Edit here: Update skill logic
└── evals/evals.json   ← Test cases

skills/paper-crawler/
├── SKILL.md           ← Edit here: Update crawler logic
└── evals/evals.json   ← Test cases
```

### Tests (For quick iteration)

```
tests/
├── test-daily-briefing.js    ← Quick test runner
└── test-paper-crawler.js     ← Quick test runner
```

---

## 6. Common Workflows

### Add New Category to Daily Briefing

```
1. Open: skills/daily-briefing/SKILL.md

2. Find: "Content Discovery by Category"

3. Add new category (e.g., "Science"):
   - #### Science (News sources)
   - Focus: Scientific breakthroughs...
   - Recency: Within last 24 hours...

4. Save file

5. Terminal: npm run dev:daily-briefing
   (Tests run automatically)

6. See results, iterate if needed
```

### Test Email Formatting

```
1. Open: tests/test-daily-briefing.js

2. Find: function generateHTMLEmail()

3. Modify HTML template as needed

4. Save

5. Watch mode auto-runs tests

6. See formatted email output in terminal
```

### Add Analytics to Papers

```
1. Open: tests/test-paper-crawler.js

2. Find: mockPaperData array

3. Add new fields to each paper:
   - citations
   - has_code
   - research_area

4. Save

5. Tests run, see validation results

6. Iterate based on output
```

---

## 7. VSCode Extensions (Recommended)

Install these for faster development:

```
1. "REST Client" (by Huachao Zheng)
   - Test API endpoints
   - Store requests in .rest files

2. "Thunder Client" (by Ranga Vadhineni)
   - Alternative to REST Client
   - Lightweight, fast

3. "Prettier" (by Prettier)
   - Auto-format code
   - Consistent style

4. "ESLint" (by Microsoft)
   - Code quality checks
   - Real-time linting
```

---

## 8. Keyboard Shortcuts (Speed Up)

```
Ctrl + `              Open integrated terminal
F5                    Start debugging
Ctrl + Shift + D      Go to debug panel
Ctrl + K, Ctrl + C    Comment code
Ctrl + K, Ctrl + U    Uncomment code
Ctrl + Alt + ↓        Copy line down
Ctrl + G              Go to line
Ctrl + Shift + F      Find in all files
Ctrl + Shift + H      Find and replace
```

---

## 9. Debugging

### Debug Tests in VS Code

1. Click line number to set breakpoint
2. Press `F5` to start debugging
3. Use Debug Console to inspect variables
4. Step through execution

### View Test Output

```bash
# Verbose output
DEBUG=* npm run test:daily-briefing

# Quiet mode (only pass/fail)
npm run test:daily-briefing 2>/dev/null
```

---

## 10. Making Changes Quickly

### Example: Add 10 papers instead of 5

```
File: tests/test-paper-crawler.js
Line: const mockPaperData = [...]

Current: 5 papers
Change: Add 5 more papers to array

Save → Watch mode runs → See output → Verify works → Done
```

**Total time: < 1 minute**

---

## 11. Useful npm Commands

```bash
# Run all tests
npm run test:all

# Watch both skills
npm run dev:daily-briefing &
npm run dev:paper-crawler

# Format code
npm run format

# Check for lint errors
npm run lint

# Start local server (if added)
npm start
```

---

## 12. Testing Checklist

Before committing changes:

```
□ Unit tests pass (npm run test:all)
□ No lint errors (npm run lint)
□ Code formatted (npm run format)
□ Manual testing done (spot check features)
□ Documentation updated (SKILL.md)
□ Performance acceptable (< 10ms per operation)
```

---

## 13. Performance Tips

### View Test Performance

```bash
npm run test:daily-briefing

# Shows:
# ✓ Average: 0.45ms per briefing
# ✓ Rate: 2222 briefings/sec
```

### If Tests Run Slow

1. Check for network calls (should be mocked)
2. Verify no external API calls
3. Check file system operations
4. Profile with: `node --prof tests/test-daily-briefing.js`

---

## 14. Live Iteration Example

### Scenario: Quick email template change

```
Time 0:00
$ npm run dev:daily-briefing
(Watch mode active)

Time 0:15
Edit: tests/test-daily-briefing.js
Change: Email header color from blue to purple

Time 0:20
Save file

Time 0:22
✓ TEST 2: Format as HTML Email
✓ Generated HTML email
✓ File size: 2.45 KB
✓ Contains header: true
✓ Contains analytics: true
✓ Contains links: true

Time 0:25
Perfect! Change looks good.
```

**Total iteration time: 25 seconds**

---

## 15. Troubleshooting

### Tests not running?

```bash
# Install dependencies
npm install

# Clear cache
rm -rf node_modules package-lock.json
npm install

# Try again
npm run test:daily-briefing
```

### Watch mode not triggering?

```bash
# Install nodemon globally (optional)
npm install -g nodemon

# Restart watch
npm run dev:daily-briefing
```

### Port already in use?

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Try again
npm start
```

---

## 16. Next Steps After Setup

1. **Run tests** → `npm run test:all` ✓
2. **Start watch mode** → `npm run dev:daily-briefing`
3. **Edit SKILL.md** → Make your first change
4. **See results** → Tests auto-run
5. **Iterate** → Keep improving

---

## 17. Pro Tips

✅ **Use watch mode** — No need to re-run manually
✅ **Keep terminal visible** — Easier to see results
✅ **Use breakpoints** — For complex debugging
✅ **Add console.log()** — Quick debugging
✅ **Split terminal** — Run multiple tests side-by-side
✅ **Use git branches** — One branch per feature

---

## 18. Save Time With Aliases

Add to `.bashrc` or `.zshrc`:

```bash
alias ztest="npm run test:all"
alias zdev="npm run dev:daily-briefing"
alias zzdev="npm run dev:paper-crawler"
alias zfmt="npm run format"
alias zlint="npm run lint"
```

Then use:
```bash
ztest      # Run all tests
zdev       # Watch daily briefing
```

---

## 19. VS Code Settings (Optional)

Create/edit `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "files.exclude": {
    "node_modules": true,
    ".env": true
  }
}
```

---

## 20. You're Ready! 🚀

**You now have:**
- ✅ Zenith cloned locally
- ✅ Dependencies installed
- ✅ Tests running
- ✅ VS Code configured
- ✅ Watch mode active
- ✅ Quick iteration setup

**Next: Make your first change!**

```bash
npm run dev:daily-briefing

# Then edit skills/daily-briefing/SKILL.md
# See tests run automatically
# Iterate in real-time
```

---

**Happy coding! 🎉**

Questions? Check README.md or USAGE.md for more details.
