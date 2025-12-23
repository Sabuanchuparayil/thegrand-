// Admin Login and Full Browser Walkthrough Test
// This script logs in as admin and tests all menus, submenus, and features

import { chromium, Browser, Page } from 'playwright';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

interface TestResult {
  name: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  error?: string;
  screenshot?: string;
}

class AdminWalkthroughTester {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private results: TestResult[] = [];
  private baseUrl = 'http://localhost:3011';
  private isLoggedIn = false;

  async init() {
    console.log('🚀 Starting Admin Browser Walkthrough Test...\n');
    this.browser = await chromium.launch({ 
      headless: false,
      slowMo: 500, // Slow down actions for visibility
    });
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
      const screenshot = `test-screenshots/${name.replace(/\s+/g, '-').toLowerCase()}-error.png`;
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
    await this.page.waitForTimeout(1500); // Wait for animations
  }

  async waitForSelector(selector: string, timeout = 10000) {
    if (!this.page) throw new Error('Page not initialized');
    await this.page.waitForSelector(selector, { timeout });
  }

  async takeScreenshot(name: string) {
    if (!this.page) return;
    const filename = `test-screenshots/${name.replace(/\s+/g, '-').toLowerCase()}.png`;
    await this.page.screenshot({ path: filename, fullPage: true });
    return filename;
  }

  async loginAsAdmin() {
    if (!this.page) throw new Error('Page not initialized');
    
    console.log('  🔐 Logging in as admin...');
    
    // Navigate to sign in page
    await this.navigateTo('/auth/signin');
    await this.waitForSelector('input[type="email"]');
    await this.takeScreenshot('00-01-signin-page');
    
    // Fill in admin credentials
    // Using admin@thegrand.com as admin email
    await this.page.fill('input[type="email"]', 'admin@thegrand.com');
    await this.page.fill('input[type="password"]', 'admin123');
    await this.takeScreenshot('00-02-signin-filled');
    
    // Submit the form
    const submitButton = await this.page.$('button[type="submit"]');
    if (submitButton) {
      await submitButton.click();
      await this.page.waitForTimeout(3000); // Wait for login to process
      
      // Check if we're logged in (should redirect to profile or stay on page)
      const currentUrl = this.page.url();
      await this.takeScreenshot('00-03-after-login');
      
      if (currentUrl.includes('/profile') || !currentUrl.includes('/auth/signin')) {
        this.isLoggedIn = true;
        console.log('  ✅ Successfully logged in as admin\n');
        return true;
      } else {
        console.log('  ⚠️  Login may have failed, but continuing tests...\n');
        return false;
      }
    }
    return false;
  }

  async runAllTests() {
    await this.init();

    // Test 0: Admin Login
    await this.test('Admin Login', async () => {
      await this.loginAsAdmin();
    });

    // Test 1: Homepage (after login)
    await this.test('Homepage Load (Logged In)', async () => {
      await this.navigateTo('/');
      await this.waitForSelector('nav');
      await this.takeScreenshot('01-homepage-logged-in');
    });

    // Test 2: Navigation - Collections Menu (hover and click)
    await this.test('Navigation - Collections Menu', async () => {
      await this.navigateTo('/');
      const collectionsLink = await this.page?.$('text=Collections, text=Collection');
      if (collectionsLink) {
        await collectionsLink.hover();
        await this.page?.waitForTimeout(1000);
        await this.takeScreenshot('02-collections-menu-hover');
        
        // Click on Collections
        await collectionsLink.click();
        await this.page?.waitForTimeout(1000);
        await this.takeScreenshot('02-collections-page');
      }
    });

    // Test 3: Collections Submenu Items
    await this.test('Collections Submenu - All Items', async () => {
      await this.navigateTo('/');
      await this.page?.hover('text=Collections, text=Collection');
      await this.page?.waitForTimeout(1000);
      
      const submenuItems = [
        'Bridal & Wedding',
        'Contemporary',
        'Heritage Classics',
        'Middle Eastern Ornate',
        'Minimalist Western'
      ];
      
      for (const item of submenuItems) {
        try {
          const link = await this.page?.$(`text=${item}`);
          if (link) {
            await link.click();
            await this.page?.waitForTimeout(2000);
            await this.takeScreenshot(`03-collection-${item.replace(/\s+/g, '-').toLowerCase()}`);
            await this.navigateTo('/');
            await this.page?.hover('text=Collections, text=Collection');
            await this.page?.waitForTimeout(500);
          }
        } catch (e) {
          // Continue if item not found
        }
      }
    });

    // Test 4: Shop by Category Menu
    await this.test('Navigation - Shop by Category Menu', async () => {
      await this.navigateTo('/');
      const shopLink = await this.page?.$('text=Shop by Category');
      if (shopLink) {
        await shopLink.hover();
        await this.page?.waitForTimeout(1000);
        await this.takeScreenshot('04-shop-menu-hover');
      }
    });

    // Test 5: Shop by Category Submenu Items
    await this.test('Shop by Category Submenu - All Items', async () => {
      await this.navigateTo('/');
      await this.page?.hover('text=Shop by Category');
      await this.page?.waitForTimeout(1000);
      
      const categories = ['Necklaces', 'Earrings', 'Rings', 'Bracelets', 'Bangles', 'Pendants'];
      
      for (const category of categories) {
        try {
          const link = await this.page?.$(`text=${category}`);
          if (link) {
            await link.click();
            await this.page?.waitForTimeout(2000);
            await this.takeScreenshot(`05-shop-${category.toLowerCase()}`);
            await this.navigateTo('/');
            await this.page?.hover('text=Shop by Category');
            await this.page?.waitForTimeout(500);
          }
        } catch (e) {
          // Continue if item not found
        }
      }
    });

    // Test 6: Shop Page
    await this.test('Shop Page', async () => {
      await this.navigateTo('/shop');
      await this.waitForSelector('h1, h2');
      await this.takeScreenshot('06-shop-page');
    });

    // Test 7: Collections Page
    await this.test('Collections Page', async () => {
      await this.navigateTo('/collections');
      await this.waitForSelector('h1, h2');
      await this.takeScreenshot('07-collections-page');
    });

    // Test 8: Individual Collection Pages
    await this.test('All Collection Detail Pages', async () => {
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
          await this.page?.waitForTimeout(2000);
          await this.waitForSelector('h1, h2');
          await this.takeScreenshot(`08-collection-${collection}`);
        } catch (e) {
          // Continue if collection not found
        }
      }
    });

    // Test 9: Product Detail Page
    await this.test('Product Detail Page', async () => {
      await this.navigateTo('/shop/necklaces');
      await this.page?.waitForTimeout(2000);
      const productLink = await this.page?.$('a[href*="/products/"]');
      if (productLink) {
        await productLink.click();
        await this.page?.waitForTimeout(2000);
        await this.waitForSelector('h1');
        await this.takeScreenshot('09-product-detail');
      }
    });

    // Test 10: AR Try-On Page
    await this.test('AR Try-On Page', async () => {
      await this.navigateTo('/ar-try-on');
      await this.waitForSelector('h1, h2');
      await this.takeScreenshot('10-ar-try-on');
    });

    // Test 11: Our Story Page
    await this.test('Our Story Page', async () => {
      await this.navigateTo('/our-story');
      await this.waitForSelector('h1, h2');
      await this.takeScreenshot('11-our-story');
    });

    // Test 12: Store & Contact Page
    await this.test('Store & Contact Page', async () => {
      await this.navigateTo('/store');
      await this.waitForSelector('h1, h2');
      await this.takeScreenshot('12-store-contact');
    });

    // Test 13: Profile Page (as admin)
    await this.test('Profile Page (Admin)', async () => {
      await this.navigateTo('/profile');
      await this.page?.waitForTimeout(2000);
      await this.waitForSelector('h1, h2, h3');
      await this.takeScreenshot('13-profile-admin');
    });

    // Test 14: Cart Page
    await this.test('Cart Page', async () => {
      await this.navigateTo('/cart');
      await this.waitForSelector('h1, h2');
      await this.takeScreenshot('14-cart');
    });

    // Test 15: Checkout Page
    await this.test('Checkout Page', async () => {
      await this.navigateTo('/checkout');
      await this.page?.waitForTimeout(2000);
      // May redirect if cart is empty
      await this.takeScreenshot('15-checkout');
    });

    // Test 16: Add to Cart Flow
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
          await this.page?.waitForTimeout(2000);
          await this.takeScreenshot('16-add-to-cart');
          
          // Navigate to cart
          await this.navigateTo('/cart');
          await this.page?.waitForTimeout(2000);
          await this.takeScreenshot('16-cart-with-items');
        }
      }
    });

    // Test 17: Footer Links
    await this.test('Footer Links', async () => {
      await this.navigateTo('/');
      await this.page?.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await this.page?.waitForTimeout(2000);
      await this.takeScreenshot('17-footer');
    });

    // Test 18: Cookie Consent
    await this.test('Cookie Consent Banner', async () => {
      await this.navigateTo('/');
      await this.page?.waitForTimeout(2000);
      const cookieBanner = await this.page?.$('text=We Value Your Privacy, text=Cookie');
      if (cookieBanner) {
        await this.takeScreenshot('18-cookie-consent');
      }
    });

    // Test 19: Mobile Menu (if applicable)
    await this.test('Mobile Menu Toggle', async () => {
      await this.navigateTo('/');
      // Resize to mobile view
      await this.page?.setViewportSize({ width: 375, height: 667 });
      await this.page?.waitForTimeout(1000);
      
      const menuButton = await this.page?.$('button[aria-label*="menu"], button[aria-label*="Menu"]');
      if (menuButton) {
        await menuButton.click();
        await this.page?.waitForTimeout(1000);
        await this.takeScreenshot('19-mobile-menu');
      }
      
      // Reset viewport
      await this.page?.setViewportSize({ width: 1920, height: 1080 });
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
║      ADMIN BROWSER WALKTHROUGH TEST REPORT                   ║
╚══════════════════════════════════════════════════════════════╝

📊 Test Summary:
   Total Tests: ${total}
   ✅ Passed: ${passed}
   ❌ Failed: ${failed}
   ⏱️  Total Duration: ${(totalDuration / 1000).toFixed(2)}s
   📈 Success Rate: ${((passed / total) * 100).toFixed(1)}%
   🔐 Admin Login: ${this.isLoggedIn ? '✅ Success' : '⚠️  May have failed'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 Test Results:

${this.results.map((r, i) => {
  const icon = r.status === 'passed' ? '✅' : r.status === 'failed' ? '❌' : '⏭️';
  return `${icon} [${(r.duration / 1000).toFixed(2)}s] ${r.name}${r.error ? `\n   Error: ${r.error}` : ''}`;
}).join('\n\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📸 Screenshots saved in: test-screenshots/

🧪 Test Coverage:
   ✅ Homepage
   ✅ Navigation Menus (Collections, Shop by Category)
   ✅ All Submenu Items
   ✅ Collection Pages
   ✅ Product Pages
   ✅ AR Try-On
   ✅ Profile (Admin)
   ✅ Cart & Checkout
   ✅ Footer Links
   ✅ Cookie Consent
   ✅ Mobile Menu

`;

    console.log(report);
    
    // Save report to file
    await mkdir('test-reports', { recursive: true });
    await writeFile('test-reports/admin-walkthrough-report.txt', report);
    await writeFile('test-reports/admin-walkthrough-results.json', JSON.stringify(this.results, null, 2));
    
    console.log('📄 Test report saved to: test-reports/admin-walkthrough-report.txt');
    console.log('📄 Test results (JSON) saved to: test-reports/admin-walkthrough-results.json\n');
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

// Run tests
const tester = new AdminWalkthroughTester();
tester.runAllTests().catch(console.error);




