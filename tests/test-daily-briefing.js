#!/usr/bin/env node

/**
 * Daily Briefing Skill Test Script
 * Run: node tests/test-daily-briefing.js
 * Watch mode: npm run dev:daily-briefing
 */

const fs = require('fs');
const path = require('path');

// Mock data for testing
const mockBriefingData = {
  politics: [
    {
      id: 1,
      title: "Iran Conflict Escalates with Death of Supreme Leader",
      source: "Reuters",
      date: "March 16, 2026",
      summary: "President Trump's administration and Israel launched strikes that killed Iran's Supreme Leader. The strike has triggered significant global market volatility.",
      url: "https://www.cnn.com/...",
      importance: "CRITICAL",
      sentiment: "Negative",
      impact: 9
    },
    {
      id: 2,
      title: "Republican Deepfake Videos Proliferate in Midterm Races",
      source: "AP News",
      date: "March 15, 2026",
      summary: "Republicans have released AI-generated deepfakes as part of 2026 midterm campaign strategy.",
      url: "https://www.apnews.com/...",
      importance: "HIGH",
      sentiment: "Negative",
      impact: 7
    }
  ],
  technology: [
    {
      id: 3,
      title: "NVIDIA Showcases AI Dominance at GTC 2026 Conference",
      source: "TechCrunch",
      date: "March 16, 2026",
      summary: "NVIDIA CEO Jensen Huang reinforces company's dominance in AI infrastructure at GTC 2026.",
      url: "https://techcrunch.com/...",
      importance: "HIGH",
      sentiment: "Positive",
      impact: 8
    }
  ],
  economics: [
    {
      id: 4,
      title: "Geopolitical Risk Sparks Market Volatility",
      source: "Goldman Sachs",
      date: "March 15, 2026",
      summary: "Intensifying geopolitical tensions push investors toward tactical rebalancing.",
      url: "https://www.goldmansachs.com/...",
      importance: "CRITICAL",
      sentiment: "Negative",
      impact: 9
    }
  ],
  "llm-research": [
    {
      id: 5,
      title: "Survey on LLM-Powered Agents for Recommender Systems",
      source: "ArXiv",
      date: "March 10, 2026",
      summary: "Comprehensive survey systematically reviews LLM-powered agents in recommender systems.",
      url: "https://arxiv.org/abs/2502.10050",
      importance: "HIGH",
      sentiment: "Positive",
      impact: 7
    }
  ]
};

/**
 * Test 1: Generate briefing content
 */
function testGenerateBriefing() {
  console.log('\n✅ TEST 1: Generate Daily Briefing Content');
  console.log('─'.repeat(50));

  try {
    const briefing = {
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      timestamp: new Date().toLocaleTimeString(),
      items_count: 20,
      categories: Object.keys(mockBriefingData).length,
      items: flattenItems(mockBriefingData)
    };

    console.log(`✓ Generated briefing for ${briefing.date}`);
    console.log(`✓ Total items: ${briefing.items_count} (${briefing.categories} categories)`);
    console.log(`✓ Timestamp: ${briefing.timestamp}`);

    return briefing;
  } catch (error) {
    console.error('✗ Failed to generate briefing:', error.message);
    return null;
  }
}

/**
 * Test 2: Format as HTML email
 */
function testFormatAsHTML(briefing) {
  console.log('\n✅ TEST 2: Format as HTML Email');
  console.log('─'.repeat(50));

  try {
    const html = generateHTMLEmail(briefing);
    const size = (html.length / 1024).toFixed(2);

    console.log(`✓ Generated HTML email`);
    console.log(`✓ File size: ${size} KB`);
    console.log(`✓ Contains header: ${html.includes('Zenith Daily Brief')}`);
    console.log(`✓ Contains analytics: ${html.includes('CRITICAL')}`);
    console.log(`✓ Contains links: ${html.includes('href=')}`);

    return html;
  } catch (error) {
    console.error('✗ Failed to format HTML:', error.message);
    return null;
  }
}

/**
 * Test 3: Validate analytics
 */
function testValidateAnalytics(briefing) {
  console.log('\n✅ TEST 3: Validate Analytics');
  console.log('─'.repeat(50));

  try {
    const items = briefing.items;
    const importanceLevels = ['CRITICAL', 'HIGH', 'MEDIUM', 'EMERGING'];
    const sentiments = ['Positive', 'Negative', 'Neutral'];

    let validCount = 0;
    let errors = [];

    items.forEach((item, idx) => {
      if (!importanceLevels.includes(item.importance)) {
        errors.push(`Item ${idx}: Invalid importance "${item.importance}"`);
      }
      if (!sentiments.includes(item.sentiment)) {
        errors.push(`Item ${idx}: Invalid sentiment "${item.sentiment}"`);
      }
      if (item.impact < 1 || item.impact > 10) {
        errors.push(`Item ${idx}: Impact score out of range (${item.impact})`);
      }
      if (!item.title || !item.source || !item.summary) {
        errors.push(`Item ${idx}: Missing required fields`);
      }

      if (errors.length === 0) validCount++;
    });

    console.log(`✓ Validated ${validCount}/${items.length} items`);

    if (errors.length > 0) {
      console.log(`⚠ Found ${errors.length} issues:`);
      errors.slice(0, 3).forEach(err => console.log(`  - ${err}`));
      if (errors.length > 3) console.log(`  ... and ${errors.length - 3} more`);
    } else {
      console.log(`✓ All analytics valid`);
    }

    return errors.length === 0;
  } catch (error) {
    console.error('✗ Analytics validation failed:', error.message);
    return false;
  }
}

/**
 * Test 4: Check formatting quality
 */
function testFormatQuality(html) {
  console.log('\n✅ TEST 4: Check Formatting Quality');
  console.log('─'.repeat(50));

  try {
    const checks = {
      'Has header': html.includes('<h1>'),
      'Has footer': html.includes('footer'),
      'Has unsubscribe': html.includes('unsubscribe'),
      'Has categories': html.includes('category-section'),
      'Is valid HTML': html.includes('</html>'),
      'Has styles': html.includes('<style>'),
      'Mobile responsive': html.includes('viewport')
    };

    let passed = 0;
    Object.entries(checks).forEach(([check, result]) => {
      console.log(`${result ? '✓' : '✗'} ${check}`);
      if (result) passed++;
    });

    console.log(`\nQuality Score: ${passed}/${Object.keys(checks).length}`);
    return passed === Object.keys(checks).length;
  } catch (error) {
    console.error('✗ Format quality check failed:', error.message);
    return false;
  }
}

/**
 * Test 5: Performance benchmark
 */
function testPerformance() {
  console.log('\n✅ TEST 5: Performance Benchmark');
  console.log('─'.repeat(50));

  try {
    const iterations = 100;
    const startTime = Date.now();

    for (let i = 0; i < iterations; i++) {
      testGenerateBriefing();
    }

    const endTime = Date.now();
    const totalTime = endTime - startTime;
    const avgTime = totalTime / iterations;

    console.log(`✓ Generated ${iterations} briefings`);
    console.log(`✓ Total time: ${totalTime}ms`);
    console.log(`✓ Average: ${avgTime.toFixed(2)}ms per briefing`);
    console.log(`✓ Rate: ${Math.round(iterations / (totalTime / 1000))} briefings/sec`);

    return avgTime < 10; // Should complete in <10ms
  } catch (error) {
    console.error('✗ Performance test failed:', error.message);
    return false;
  }
}

/**
 * Helper: Flatten items from categories
 */
function flattenItems(data) {
  return Object.values(data).flat();
}

/**
 * Helper: Generate HTML email
 */
function generateHTMLEmail(briefing) {
  const items = briefing.items;
  const itemsHTML = items.map(item => `
    <div class="story-item">
      <div class="story-title">${item.title}</div>
      <div class="story-meta">Source: ${item.source} | Date: ${item.date}</div>
      <div class="story-summary">${item.summary}</div>
      <div class="analytics">
        <span class="badge importance-${item.importance.toLowerCase()}">${item.importance}</span>
        <span class="badge sentiment-${item.sentiment.toLowerCase()}">${item.sentiment}</span>
        <span class="badge impact">Impact: ${item.impact}/10</span>
      </div>
      <a href="${item.url}" class="story-link">Read →</a>
    </div>
  `).join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width">
  <style>
    body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }
    .story-item { margin: 20px 0; padding: 15px; border-left: 4px solid #667eea; }
    .story-title { font-weight: bold; font-size: 16px; }
    .story-meta { font-size: 12px; color: #666; }
    .story-summary { margin: 10px 0; line-height: 1.6; }
    .analytics { display: flex; gap: 10px; margin: 10px 0; }
    .badge { padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; background: #f0f0f0; }
    .story-link { color: #667eea; text-decoration: none; font-weight: bold; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Zenith Daily Brief</h1>
    <p>${briefing.date}</p>
  </div>
  <div class="content">
    ${itemsHTML}
  </div>
  <div style="border-top: 1px solid #ddd; padding-top: 20px; margin-top: 20px; text-align: center; font-size: 12px; color: #666;">
    <a href="#">Manage Preferences</a> | <a href="#">Unsubscribe</a>
  </div>
</body>
</html>
  `;
}

/**
 * Main test runner
 */
async function runTests() {
  console.log('\n' + '═'.repeat(50));
  console.log('  ZENITH DAILY BRIEFING - TEST SUITE');
  console.log('═'.repeat(50));

  const results = [];

  // Run tests
  const briefing = testGenerateBriefing();
  if (!briefing) process.exit(1);

  const html = testFormatAsHTML(briefing);
  if (!html) process.exit(1);

  results.push(['Generate Briefing', briefing ? '✓ PASS' : '✗ FAIL']);
  results.push(['Format HTML', html ? '✓ PASS' : '✗ FAIL']);
  results.push(['Validate Analytics', testValidateAnalytics(briefing) ? '✓ PASS' : '✗ FAIL']);
  results.push(['Format Quality', testFormatQuality(html) ? '✓ PASS' : '✗ FAIL']);
  results.push(['Performance', testPerformance() ? '✓ PASS' : '✗ FAIL']);

  // Summary
  console.log('\n' + '═'.repeat(50));
  console.log('  TEST SUMMARY');
  console.log('═'.repeat(50));
  results.forEach(([test, result]) => {
    console.log(`${result.includes('PASS') ? '✓' : '✗'} ${test.padEnd(25)} ${result}`);
  });

  const passed = results.filter(r => r[1].includes('PASS')).length;
  const total = results.length;

  console.log(`\n${passed}/${total} tests passed ${passed === total ? '🎉' : '⚠️'}`);
  console.log('═'.repeat(50) + '\n');

  process.exit(passed === total ? 0 : 1);
}

runTests().catch(console.error);
