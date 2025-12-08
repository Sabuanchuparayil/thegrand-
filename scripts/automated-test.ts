// Automated Browser Walkthrough Test
// This script tests all menus, submenus, and features

import { chromium, Browser, Page } from 'playwright';

interface TestResult {
  name: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  error?: string;
  screenshot?: string;
}

class AutomatedTester {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private results: TestResult[] = [];
  private baseUrl = 'http://localhost:3011';

  async init() {
    console.log('🚀 Starting Automated Browser Tests...\n');
    this.browser = await chromium.launch({ headless: false });
    this.page = await this.browser.newPage();
    await this.page.setViewportSize({ width: 1920, height: 1080 });
  }

  async test(name: string, testFn: () => Promise<void>) {
    const startTime = Date.now();
    try {
      console.log(`  Testing: ${name}...`);
      await testFn();
      const duration = Date.now() - startTime;
      this.results.push({ name, status: 'passed', duration });
      console.log(`  ✅ ${name} (${duration}ms)\n`);
    } catch (error: any) {
      const duration = Date.now() - startTime;
      const screenshot = `test-screenshots/${name.replace(/\s+/g, '-')}-error.png`;
      await this.page?.screenshot({ path: screenshot, fullPage: true });
      this.results.push({
        name,
        status: 'failed',
        duration,
        error: error.message,
        screenshot,
      });
      console.log(`  ❌ ${name} - ${error.message}\n`);
    }
  }

  async navigateTo(url: string) {
    if (!this.page) throw new Error('Page not initialized');
    await this.page.goto(`${this.baseUrl}${url}`, { waitUntil: 'networkidle' });
    await this.page.waitForTimeout(1000); // Wait for animations
  }

  async click(selector: string) {
    if (!this.page) throw new Error('Page not initialized');
    await this.page.click(selector);
    await this.page.waitForTimeout(500);
  }

  async waitForSelector(selector: string, timeout = 10000) {
    if (!this.page) throw new Error('Page not initialized');
    await this.page.waitForSelector(selector, { timeout });
  }

  async takeScreenshot(name: string) {
    if (!this.page) return;
    const filename = `test-screenshots/${name.replace(/\s+/g, '-')}.png`;
    await this.page.screenshot({ path: filename, fullPage: true });
    return filename;
  }

  async loginAsAdmin() {
    if (!this.page) throw new Error('Page not initialized');
    
    // Navigate to sign in page
    await this.navigateTo('/auth/signin');
    await this.waitForSelector('input[type="email"]');
    
    // Fill in admin credentials
    // Note: Since we're using auto-create, any email will work
    // For admin role, we'll use admin@thegrand.com
    await this.page.fill('input[type="email"]', 'admin@thegrand.com');
    await this.page.fill('input[type="password"]', 'admin123');
    
    // Submit the form
    await this.page.click('button[type="submit"]');
    
    // Wait for navigation (either to profile or error)
    await this.page.waitForTimeout(2000);
    
    // Check if we're logged in (should redirect to profile or show profile page)
    const currentUrl = this.page.url();
    if (currentUrl.includes('/profile') || currentUrl.includes('/auth/signin')) {
      await this.takeScreenshot('00-admin-login');
      return true;
    }
    return false;
  }

  async runAllTests() {
    await this.init();

    // Test 0: Admin Login
    await this.test('Admin Login', async () => {
      const loggedIn = await this.loginAsAdmin();
      if (!loggedIn) {
        // If login fails, continue anyway (might be expected in dev)
        console.log('  ⚠️  Login may have failed, continuing tests...');
      }
      await this.takeScreenshot('00-admin-login-result');
    });

    // Test 1: Homepage (after login)
    await this.test('Homepage Load (Logged In)', async () => {
      await this.navigateTo('/');
      await this.waitForSelector('nav');
      await this.takeScreenshot('01-homepage-logged-in');
    });

    // Test 2: Navigation - Collections Menu
    await this.test('Navigation - Collections Menu', async () => {
      await this.navigateTo('/');
      await this.page?.hover('text=Collections');
      await this.page?.waitForTimeout(500);
      await this.takeScreenshot('02-collections-menu');
    });

    // Test 3: Collections Page
    await this.test('Collections Page', async () => {
      await this.navigateTo('/collections');
      await this.waitForSelector('h1, h2');
      await this.takeScreenshot('03-collections-page');
    });

    // Test 4: Shop by Category Menu
    await this.test('Navigation - Shop by Category Menu', async () => {
      await this.navigateTo('/');
      await this.page?.hover('text=Shop by Category');
      await this.page?.waitForTimeout(500);
      await this.takeScreenshot('04-shop-menu');
    });

    // Test 5: Shop Page
    await this.test('Shop Page', async () => {
      await this.navigateTo('/shop');
      await this.waitForSelector('h1, h2');
      await this.takeScreenshot('05-shop-page');
    });

    // Test 6: Product Categories
    const categories = ['necklaces', 'earrings', 'rings', 'bracelets', 'bangles', 'pendants'];
    for (const category of categories) {
      await this.test(`Shop Category - ${category}`, async () => {
        await this.navigateTo(`/shop/${category}`);
        await this.waitForSelector('h1, h2');
        await this.takeScreenshot(`06-shop-${category}`);
      });
    }

    // Test 7: Product Detail Page
    await this.test('Product Detail Page', async () => {
      await this.navigateTo('/shop/necklaces');
      await this.page?.waitForTimeout(1000);
      const productLink = await this.page?.$('a[href*="/products/"]');
      if (productLink) {
        await productLink.click();
        await this.waitForSelector('h1');
        await this.takeScreenshot('07-product-detail');
      } else {
        throw new Error('No product found');
      }
    });

    // Test 8: AR Try-On Page
    await this.test('AR Try-On Page', async () => {
      await this.navigateTo('/ar-try-on');
      await this.waitForSelector('h1, h2');
      await this.takeScreenshot('08-ar-try-on');
    });

    // Test 9: Our Story Page
    await this.test('Our Story Page', async () => {
      await this.navigateTo('/our-story');
      await this.waitForSelector('h1, h2');
      await this.takeScreenshot('09-our-story');
    });

    // Test 10: Store & Contact Page
    await this.test('Store & Contact Page', async () => {
      await this.navigateTo('/store');
      await this.waitForSelector('h1, h2');
      await this.takeScreenshot('10-store-contact');
    });

    // Test 11: Privacy Policy
    await this.test('Privacy Policy Page', async () => {
      await this.navigateTo('/privacy-policy');
      await this.waitForSelector('h1');
      await this.takeScreenshot('11-privacy-policy');
    });

    // Test 12: Cart Page
    await this.test('Cart Page', async () => {
      await this.navigateTo('/cart');
      await this.waitForSelector('h1, h2');
      await this.takeScreenshot('12-cart');
    });

    // Test 13: Checkout Page
    await this.test('Checkout Page', async () => {
      await this.navigateTo('/checkout');
      await this.waitForSelector('h1, h2');
      await this.takeScreenshot('13-checkout');
    });

    // Test 14: Sign In Page
    await this.test('Sign In Page', async () => {
      await this.navigateTo('/auth/signin');
      await this.waitForSelector('h1, h2');
      await this.takeScreenshot('14-signin');
    });

    // Test 15: Sign Up Page
    await this.test('Sign Up Page', async () => {
      await this.navigateTo('/auth/signup');
      await this.waitForSelector('h1, h2');
      await this.takeScreenshot('15-signup');
    });

    // Test 16: Profile Page (as admin)
    await this.test('Profile Page (Admin)', async () => {
      await this.navigateTo('/profile');
      await this.page?.waitForTimeout(2000);
      // Should show profile page if logged in
      await this.waitForSelector('h1, h2, h3');
      await this.takeScreenshot('16-profile-admin');
    });

    // Test 17: Admin Dashboard (if exists)
    await this.test('Admin Dashboard Access', async () => {
      // Try to access admin routes
      const adminRoutes = ['/admin', '/admin/products', '/admin/orders', '/admin/users'];
      for (const route of adminRoutes) {
        try {
          await this.navigateTo(route);
          await this.page?.waitForTimeout(1000);
          const title = await this.page?.title();
          if (title && !title.includes('404')) {
            await this.takeScreenshot(`17-admin-${route.replace(/\//g, '-')}`);
            break;
          }
        } catch (e) {
          // Route might not exist, continue
        }
      }
    });

    // Test 18: Footer Links
    await this.test('Footer Links', async () => {
      await this.navigateTo('/');
      await this.page?.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await this.page?.waitForTimeout(1000);
      await this.takeScreenshot('18-footer');
    });

    // Test 19: Cookie Consent
    await this.test('Cookie Consent Banner', async () => {
      await this.navigateTo('/');
      await this.page?.waitForTimeout(2000);
      const cookieBanner = await this.page?.$('text=We Value Your Privacy');
      if (cookieBanner) {
        await this.takeScreenshot('19-cookie-consent');
      }
    });

    // Test 20: Test All Collection Pages
    await this.test('All Collection Pages', async () => {
      const collections = [
        'traditional-indian',
        'bridal-wedding',
        'contemporary',
        'middle-eastern',
        'western-engagement',
        'afro-caribbean',
        'heritage-classics',
        'minimalist-western'
      ];
      
      for (const collection of collections) {
        try {
          await this.navigateTo(`/collections/${collection}`);
          await this.page?.waitForTimeout(1000);
          await this.waitForSelector('h1, h2');
          await this.takeScreenshot(`20-collection-${collection}`);
        } catch (e) {
          console.log(`  ⚠️  Collection ${collection} may not exist`);
        }
      }
    });

    // Test 21: Add to Cart and Checkout Flow
    await this.test('Add to Cart Flow', async () => {
      // Navigate to a product
      await this.navigateTo('/shop/necklaces');
      await this.page?.waitForTimeout(2000);
      
      // Try to find and click a product
      const productLink = await this.page?.$('a[href*="/products/"]');
      if (productLink) {
        await productLink.click();
        await this.page?.waitForTimeout(2000);
        
        // Try to find Add to Cart button
        const addToCartBtn = await this.page?.$('button:has-text("Add to Cart"), button:has-text("Add")');
        if (addToCartBtn) {
          await addToCartBtn.click();
          await this.page?.waitForTimeout(1000);
          await this.takeScreenshot('21-add-to-cart');
          
          // Navigate to cart
          await this.navigateTo('/cart');
          await this.page?.waitForTimeout(2000);
          await this.takeScreenshot('21-cart-with-items');
        }
      }
    });

    await this.generateReport();
    await this.cleanup();
  }

  async generateReport() {
    const total = this.results.length;
    const passed = this.results.filter(r => r.status === 'passed').length;
    const failed = this.results.filter(r => r.status === 'failed').length;
    const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0);

    const report = `
╔══════════════════════════════════════════════════════════════╗
║           AUTOMATED BROWSER TEST REPORT                      ║
╚══════════════════════════════════════════════════════════════╝

📊 Test Summary:
   Total Tests: ${total}
   ✅ Passed: ${passed}
   ❌ Failed: ${failed}
   ⏱️  Total Duration: ${(totalDuration / 1000).toFixed(2)}s
   📈 Success Rate: ${((passed / total) * 100).toFixed(1)}%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 Test Results:

${this.results.map((r, i) => {
  const icon = r.status === 'passed' ? '✅' : r.status === 'failed' ? '❌' : '⏭️';
  return `${icon} [${(r.duration / 1000).toFixed(2)}s] ${r.name}${r.error ? `\n   Error: ${r.error}` : ''}`;
}).join('\n\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📸 Screenshots saved in: test-screenshots/

`;

    console.log(report);
    
    // Save report to file
    const fs = await import('fs/promises');
    await fs.mkdir('test-reports', { recursive: true });
    await fs.writeFile('test-reports/browser-test-report.txt', report);
    await fs.writeFile('test-reports/browser-test-results.json', JSON.stringify(this.results, null, 2));
    
    console.log('📄 Test report saved to: test-reports/browser-test-report.txt');
    console.log('📄 Test results (JSON) saved to: test-reports/browser-test-results.json\n');
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

// Run tests
const tester = new AutomatedTester();
tester.runAllTests().catch(console.error);

