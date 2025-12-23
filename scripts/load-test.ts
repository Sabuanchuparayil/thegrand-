// Load Test Script
// Tests the application under load

import { chromium, Browser, Page } from 'playwright';

interface LoadTestResult {
  endpoint: string;
  requests: number;
  success: number;
  failed: number;
  avgResponseTime: number;
  minResponseTime: number;
  maxResponseTime: number;
  errors: string[];
}

class LoadTester {
  private baseUrl = 'http://localhost:3011';
  private results: LoadTestResult[] = [];

  async testEndpoint(endpoint: string, concurrent: number = 10, total: number = 100) {
    console.log(`\n🧪 Load Testing: ${endpoint}`);
    console.log(`   Concurrent: ${concurrent}, Total: ${total}\n`);

    const responseTimes: number[] = [];
    let success = 0;
    let failed = 0;
    const errors: string[] = [];

    const browser = await chromium.launch({ headless: true });
    const pages: Page[] = [];

    // Create pages
    for (let i = 0; i < concurrent; i++) {
      pages.push(await browser.newPage());
    }

    // Run load test
    const startTime = Date.now();
    const promises: Promise<void>[] = [];

    for (let i = 0; i < total; i++) {
      const pageIndex = i % concurrent;
      const promise = (async () => {
        const page = pages[pageIndex];
        const requestStart = Date.now();
        try {
          const response = await page.goto(`${this.baseUrl}${endpoint}`, {
            waitUntil: 'networkidle',
            timeout: 30000,
          });
          const responseTime = Date.now() - requestStart;
          responseTimes.push(responseTime);
          if (response && response.ok()) {
            success++;
          } else {
            failed++;
            errors.push(`Request ${i + 1}: HTTP ${response?.status()}`);
          }
        } catch (error: any) {
          failed++;
          errors.push(`Request ${i + 1}: ${error.message}`);
        }
      })();
      promises.push(promise);
    }

    await Promise.all(promises);
    const totalTime = Date.now() - startTime;

    await browser.close();

    const avgResponseTime = responseTimes.length > 0
      ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
      : 0;
    const minResponseTime = responseTimes.length > 0 ? Math.min(...responseTimes) : 0;
    const maxResponseTime = responseTimes.length > 0 ? Math.max(...responseTimes) : 0;

    const result: LoadTestResult = {
      endpoint,
      requests: total,
      success,
      failed,
      avgResponseTime: Math.round(avgResponseTime),
      minResponseTime,
      maxResponseTime,
      errors: errors.slice(0, 10), // Limit errors shown
    };

    this.results.push(result);

    console.log(`   ✅ Success: ${success}`);
    console.log(`   ❌ Failed: ${failed}`);
    console.log(`   ⏱️  Avg Response Time: ${avgResponseTime.toFixed(2)}ms`);
    console.log(`   📊 Min: ${minResponseTime}ms, Max: ${maxResponseTime}ms`);
    console.log(`   🕐 Total Time: ${(totalTime / 1000).toFixed(2)}s`);
    console.log(`   📈 Requests/sec: ${(total / (totalTime / 1000)).toFixed(2)}`);
  }

  async runAllTests() {
    console.log('🚀 Starting Load Tests...\n');

    // Test homepage
    await this.testEndpoint('/', 10, 50);

    // Test collections
    await this.testEndpoint('/collections', 5, 30);

    // Test shop
    await this.testEndpoint('/shop', 5, 30);

    // Test product page (if exists)
    await this.testEndpoint('/shop/necklaces', 5, 20);

    // Test API endpoints
    await this.testEndpoint('/api/gold-price', 10, 50);

    this.generateReport();
  }

  generateReport() {
    const report = `
╔══════════════════════════════════════════════════════════════╗
║                    LOAD TEST REPORT                          ║
╚══════════════════════════════════════════════════════════════╝

📊 Summary:

${this.results.map(r => `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Endpoint: ${r.endpoint}
   Total Requests: ${r.requests}
   ✅ Success: ${r.success} (${((r.success / r.requests) * 100).toFixed(1)}%)
   ❌ Failed: ${r.failed} (${((r.failed / r.requests) * 100).toFixed(1)}%)
   ⏱️  Avg Response: ${r.avgResponseTime}ms
   📊 Min: ${r.minResponseTime}ms, Max: ${r.maxResponseTime}ms
${r.errors.length > 0 ? `   ⚠️  Errors: ${r.errors.length} (showing first 10)\n${r.errors.map(e => `      - ${e}`).join('\n')}` : ''}
`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

`;

    console.log(report);

    // Save report
    const fs = require('fs');
    fs.mkdirSync('test-reports', { recursive: true });
    fs.writeFileSync('test-reports/load-test-report.txt', report);
    fs.writeFileSync('test-reports/load-test-results.json', JSON.stringify(this.results, null, 2));

    console.log('📄 Load test report saved to: test-reports/load-test-report.txt');
    console.log('📄 Load test results (JSON) saved to: test-reports/load-test-results.json\n');
  }
}

// Run load tests
const loadTester = new LoadTester();
loadTester.runAllTests().catch(console.error);




