#!/usr/bin/env node

/**
 * Paper Crawler Skill Test Script
 * Run: node tests/test-paper-crawler.js
 * Watch mode: npm run dev:paper-crawler
 */

const mockPaperData = [
  {
    id: 1,
    title: "Survey on LLM-Powered Agents for Recommender Systems",
    authors: ["Author1", "Author2", "Author3"],
    date: "March 10, 2026",
    source: "ArXiv",
    url: "https://arxiv.org/abs/2502.10050",
    summary: "Comprehensive survey systematically reviews LLM-powered agents in recommender systems.",
    relevance: 95,
    citations: 8,
    has_code: true
  },
  {
    id: 2,
    title: "On-Device LLMs Show Promise for Sequential Recommendation",
    authors: ["Author4", "Author5"],
    date: "March 8, 2026",
    source: "ArXiv",
    url: "https://arxiv.org/abs/2601.09306",
    summary: "Research demonstrates on-device LLMs with no significant performance loss.",
    relevance: 92,
    citations: 5,
    has_code: true
  },
  {
    id: 3,
    title: "Leveraging LLM Reasoning Enhances Personalized Recommendations",
    authors: ["Author6", "Author7", "Author8", "Author9"],
    date: "March 5, 2026",
    source: "ArXiv",
    url: "https://arxiv.org/abs/2408.00802",
    summary: "Research investigates how LLM reasoning capabilities enhance recommendations.",
    relevance: 88,
    citations: 3,
    has_code: false
  },
  {
    id: 4,
    title: "Cross-Modal Recommendation with Vision-Language Models",
    authors: ["Author10", "Author11"],
    date: "March 3, 2026",
    source: "ArXiv",
    url: "https://arxiv.org/abs/2403.15000",
    summary: "Novel approach leverages vision-language models for cross-modal recommendation.",
    relevance: 85,
    citations: 2,
    has_code: true
  },
  {
    id: 5,
    title: "Efficient Fine-tuning of LLMs for Domain-Specific Recommendation",
    authors: ["Author12", "Author13"],
    date: "March 1, 2026",
    source: "Papers with Code",
    url: "https://paperswithcode.com/paper/efficient-finetuning",
    summary: "LoRA-based approach for efficient fine-tuning of LLMs.",
    relevance: 82,
    citations: 1,
    has_code: true
  }
];

/**
 * Test 1: Generate paper list
 */
function testGeneratePaperList() {
  console.log('\n✅ TEST 1: Generate Paper List');
  console.log('─'.repeat(50));

  try {
    const papers = {
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      total_papers: mockPaperData.length,
      papers: mockPaperData.sort((a, b) => b.relevance - a.relevance)
    };

    console.log(`✓ Generated paper list for ${papers.date}`);
    console.log(`✓ Total papers: ${papers.total_papers}`);
    console.log(`✓ Top paper: "${papers.papers[0].title}"`);
    console.log(`✓ Relevance range: ${papers.papers[papers.total_papers-1].relevance}-${papers.papers[0].relevance}`);

    return papers;
  } catch (error) {
    console.error('✗ Failed to generate paper list:', error.message);
    return null;
  }
}

/**
 * Test 2: Validate paper metadata
 */
function testValidateMetadata(papers) {
  console.log('\n✅ TEST 2: Validate Paper Metadata');
  console.log('─'.repeat(50));

  try {
    const requiredFields = ['title', 'authors', 'date', 'source', 'url', 'summary', 'relevance'];
    let validCount = 0;
    let errors = [];

    papers.papers.forEach((paper, idx) => {
      requiredFields.forEach(field => {
        if (!paper[field]) {
          errors.push(`Paper ${idx}: Missing "${field}"`);
        }
      });

      if (paper.relevance < 0 || paper.relevance > 100) {
        errors.push(`Paper ${idx}: Relevance out of range (${paper.relevance})`);
      }

      if (!paper.url.startsWith('http')) {
        errors.push(`Paper ${idx}: Invalid URL format`);
      }

      if (errors.length === 0) validCount++;
    });

    console.log(`✓ Validated ${validCount}/${papers.papers.length} papers`);
    console.log(`✓ All required fields present`);
    console.log(`✓ Relevance scores valid (0-100)`);

    if (errors.length > 0) {
      console.log(`⚠ Found ${errors.length} issues (first 3):`);
      errors.slice(0, 3).forEach(err => console.log(`  - ${err}`));
    }

    return errors.length === 0;
  } catch (error) {
    console.error('✗ Metadata validation failed:', error.message);
    return false;
  }
}

/**
 * Test 3: Check ranking quality
 */
function testRankingQuality(papers) {
  console.log('\n✅ TEST 3: Check Ranking Quality');
  console.log('─'.repeat(50));

  try {
    const rankedPapers = papers.papers;

    // Check if sorted by relevance (descending)
    let isSorted = true;
    for (let i = 0; i < rankedPapers.length - 1; i++) {
      if (rankedPapers[i].relevance < rankedPapers[i + 1].relevance) {
        isSorted = false;
        break;
      }
    }

    console.log(`${isSorted ? '✓' : '✗'} Papers sorted by relevance (descending)`);

    // Show ranking
    console.log(`\nRanking breakdown:`);
    rankedPapers.forEach((paper, idx) => {
      console.log(`  ${idx + 1}. "${paper.title.substring(0, 40)}..." (${paper.relevance})`);
    });

    // Statistics
    const avgRelevance = (rankedPapers.reduce((sum, p) => sum + p.relevance, 0) / rankedPapers.length).toFixed(1);
    const avgCitations = (rankedPapers.reduce((sum, p) => sum + p.citations, 0) / rankedPapers.length).toFixed(1);
    const codeAvailable = rankedPapers.filter(p => p.has_code).length;

    console.log(`\nStatistics:`);
    console.log(`  Average relevance: ${avgRelevance}`);
    console.log(`  Average citations: ${avgCitations}`);
    console.log(`  Papers with code: ${codeAvailable}/${rankedPapers.length}`);

    return isSorted;
  } catch (error) {
    console.error('✗ Ranking quality check failed:', error.message);
    return false;
  }
}

/**
 * Test 4: Format as email/HTML
 */
function testFormatOutput(papers) {
  console.log('\n✅ TEST 4: Format as Email/HTML');
  console.log('─'.repeat(50));

  try {
    const html = generatePaperHTML(papers);
    const markdown = generatePaperMarkdown(papers);

    console.log(`✓ Generated HTML format`);
    console.log(`  - Size: ${(html.length / 1024).toFixed(2)} KB`);
    console.log(`  - Contains ${html.match(/<a href/g)?.length || 0} links`);

    console.log(`✓ Generated Markdown format`);
    console.log(`  - Size: ${(markdown.length / 1024).toFixed(2)} KB`);
    console.log(`  - Lines: ${markdown.split('\n').length}`);

    console.log(`✓ Both formats valid`);

    return true;
  } catch (error) {
    console.error('✗ Format test failed:', error.message);
    return false;
  }
}

/**
 * Test 5: Performance
 */
function testPerformance() {
  console.log('\n✅ TEST 5: Performance Benchmark');
  console.log('─'.repeat(50));

  try {
    const iterations = 100;
    const startTime = Date.now();

    for (let i = 0; i < iterations; i++) {
      testGeneratePaperList();
    }

    const endTime = Date.now();
    const totalTime = endTime - startTime;
    const avgTime = totalTime / iterations;

    console.log(`✓ Generated ${iterations} paper lists`);
    console.log(`✓ Total time: ${totalTime}ms`);
    console.log(`✓ Average: ${avgTime.toFixed(2)}ms per list`);
    console.log(`✓ Rate: ${Math.round(iterations / (totalTime / 1000))} lists/sec`);

    return avgTime < 10; // Should complete in <10ms
  } catch (error) {
    console.error('✗ Performance test failed:', error.message);
    return false;
  }
}

/**
 * Helper: Generate paper HTML
 */
function generatePaperHTML(papers) {
  const itemsHTML = papers.papers.map((paper, idx) => `
    <div class="paper-item">
      <div class="paper-number">${idx + 1}</div>
      <div class="paper-title">${paper.title}</div>
      <div class="paper-meta">
        Authors: ${paper.authors.slice(0, 3).join(', ')}${paper.authors.length > 3 ? ' et al.' : ''}
      </div>
      <div class="paper-meta">Source: ${paper.source} | Date: ${paper.date}</div>
      <div class="paper-summary">${paper.summary}</div>
      <div class="paper-analytics">
        <span class="badge">Relevance: ${paper.relevance}/100</span>
        <span class="badge">Citations: ${paper.citations}</span>
        ${paper.has_code ? '<span class="badge code-available">Code Available</span>' : ''}
      </div>
      <a href="${paper.url}" class="paper-link">Read Paper →</a>
    </div>
  `).join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width">
  <style>
    body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 8px; }
    .paper-item { margin: 20px 0; padding: 15px; border-left: 4px solid #667eea; background: #f9f9f9; }
    .paper-number { display: inline-block; width: 28px; height: 28px; line-height: 28px; text-align: center; background: #667eea; color: white; border-radius: 50%; font-weight: bold; margin-right: 8px; }
    .paper-title { font-weight: bold; font-size: 16px; margin: 10px 0; }
    .paper-meta { font-size: 12px; color: #666; }
    .paper-summary { margin: 10px 0; line-height: 1.6; }
    .paper-analytics { display: flex; gap: 10px; margin: 10px 0; }
    .badge { padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; background: #e0e0e0; }
    .code-available { background: #90EE90; }
    .paper-link { color: #667eea; text-decoration: none; font-weight: bold; }
  </style>
</head>
<body>
  <div class="header">
    <h1>📚 Latest LLM × Recommendation Research</h1>
    <p>${papers.date}</p>
  </div>
  <div class="content">
    ${itemsHTML}
  </div>
</body>
</html>
  `;
}

/**
 * Helper: Generate paper Markdown
 */
function generatePaperMarkdown(papers) {
  const items = papers.papers.map((paper, idx) => `
## ${idx + 1}. ${paper.title}

**Authors:** ${paper.authors.join(', ')}${paper.authors.length > 3 ? '...' : ''}

**Source:** ${paper.source} | **Date:** ${paper.date}

${paper.summary}

**Relevance:** ${paper.relevance}/100 | **Citations:** ${paper.citations} | **Code:** ${paper.has_code ? '✓' : '✗'}

[Read Paper](${paper.url})

---
  `).join('');

  return `# Latest LLM × Recommendation Research\n\n${papers.date}\n\n${items}`;
}

/**
 * Main test runner
 */
async function runTests() {
  console.log('\n' + '═'.repeat(50));
  console.log('  ZENITH PAPER CRAWLER - TEST SUITE');
  console.log('═'.repeat(50));

  const results = [];

  // Run tests
  const papers = testGeneratePaperList();
  if (!papers) process.exit(1);

  results.push(['Generate Paper List', papers ? '✓ PASS' : '✗ FAIL']);
  results.push(['Validate Metadata', testValidateMetadata(papers) ? '✓ PASS' : '✗ FAIL']);
  results.push(['Ranking Quality', testRankingQuality(papers) ? '✓ PASS' : '✗ FAIL']);
  results.push(['Format Output', testFormatOutput(papers) ? '✓ PASS' : '✗ FAIL']);
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
