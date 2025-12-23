// Deployment Readiness Check
// Verifies all requirements for deployment

import { readFile, access } from 'fs/promises';
import { constants } from 'fs';
import { join } from 'path';

interface CheckResult {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
}

class DeploymentChecker {
  private results: CheckResult[] = [];

  async check(name: string, checkFn: () => Promise<boolean>, message: string) {
    try {
      const result = await checkFn();
      this.results.push({
        name,
        status: result ? 'pass' : 'fail',
        message: result ? message : `Failed: ${message}`,
      });
    } catch (error: any) {
      this.results.push({
        name,
        status: 'fail',
        message: `Error: ${error.message}`,
      });
    }
  }

  async checkFile(name: string, filePath: string, required: boolean = true) {
    await this.check(
      name,
      async () => {
        try {
          await access(filePath, constants.F_OK);
          return true;
        } catch {
          return false;
        }
      },
      required ? 'File exists' : 'File exists (optional)'
    );
  }

  async checkEnvVar(name: string, required: boolean = true) {
    await this.check(
      `Environment Variable: ${name}`,
      async () => {
        return !!process.env[name];
      },
      required ? 'Environment variable is set' : 'Environment variable is set (optional)'
    );
  }

  async checkPackageJson() {
    try {
      const packageJson = JSON.parse(await readFile('package.json', 'utf-8'));
      
      // Check required scripts
      const requiredScripts = ['dev', 'build', 'start'];
      for (const script of requiredScripts) {
        await this.check(
          `Package.json script: ${script}`,
          async () => !!packageJson.scripts?.[script],
          'Script exists'
        );
      }

      // Check dependencies
      await this.check(
        'Package.json: Next.js dependency',
        async () => !!packageJson.dependencies?.next,
        'Next.js is installed'
      );
    } catch (error: any) {
      this.results.push({
        name: 'Package.json check',
        status: 'fail',
        message: `Error: ${error.message}`,
      });
    }
  }

  async checkBuild() {
    await this.check(
      'Build directory exists',
      async () => {
        try {
          await access('.next', constants.F_OK);
          return true;
        } catch {
          return false;
        }
      },
      '.next directory exists (run npm run build first)'
    );
  }

  async runAllChecks() {
    console.log('🔍 Running Deployment Readiness Checks...\n');

    // Check essential files
    await this.checkFile('package.json', 'package.json');
    await this.checkFile('next.config.ts', 'next.config.ts');
    await this.checkFile('tsconfig.json', 'tsconfig.json');
    await this.checkFile('tailwind.config.ts', 'tailwind.config.ts');
    await this.checkFile('README.md', 'README.md');

    // Check environment variables (warn if missing, but don't fail)
    await this.checkEnvVar('NEXT_PUBLIC_SANITY_PROJECT_ID', true);
    await this.checkEnvVar('NEXT_PUBLIC_SANITY_DATASET', true);
    await this.checkEnvVar('SANITY_API_TOKEN', true);
    await this.checkEnvVar('NEXT_PUBLIC_SITE_URL', false);
    await this.checkEnvVar('METALS_API_KEY', false);
    await this.checkEnvVar('STRIPE_SECRET_KEY', false);
    await this.checkEnvVar('NEXTAUTH_SECRET', false);

    // Check package.json
    await this.checkPackageJson();

    // Check build
    await this.checkBuild();

    // Check API routes
    const apiRoutes = [
      'app/api/gold-price/route.ts',
      'app/api/gold-price/scheduled/route.ts',
      'app/api/orders/create/route.ts',
      'app/api/gdpr/export/route.ts',
    ];

    for (const route of apiRoutes) {
      await this.checkFile(`API Route: ${route}`, route);
    }

    // Check key components
    const components = [
      'components/Navigation.tsx',
      'components/Footer.tsx',
      'components/Cart.tsx',
      'components/CookieConsent.tsx',
    ];

    for (const component of components) {
      await this.checkFile(`Component: ${component}`, component);
    }

    // Check schemas
    await this.checkFile('Sanity Schema: product', 'sanity/schemas/product.ts');
    await this.checkFile('Sanity Schema: user', 'sanity/schemas/user.ts');
    await this.checkFile('Sanity Schema: order', 'sanity/schemas/order.ts');

    this.generateReport();
  }

  generateReport() {
    const passed = this.results.filter(r => r.status === 'pass').length;
    const failed = this.results.filter(r => r.status === 'fail').length;
    const warnings = this.results.filter(r => r.status === 'warning').length;
    const total = this.results.length;

    const report = `
╔══════════════════════════════════════════════════════════════╗
║              DEPLOYMENT READINESS REPORT                     ║
╚══════════════════════════════════════════════════════════════╝

📊 Summary:
   Total Checks: ${total}
   ✅ Passed: ${passed}
   ❌ Failed: ${failed}
   ⚠️  Warnings: ${warnings}
   📈 Readiness: ${((passed / total) * 100).toFixed(1)}%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 Check Results:

${this.results.map(r => {
  const icon = r.status === 'pass' ? '✅' : r.status === 'fail' ? '❌' : '⚠️';
  return `${icon} ${r.name}\n   ${r.message}`;
}).join('\n\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${failed === 0 ? '✅ READY FOR DEPLOYMENT' : '❌ NOT READY - Please fix the issues above'}

`;

    console.log(report);

    // Save report
    const fs = require('fs');
    fs.mkdirSync('test-reports', { recursive: true });
    fs.writeFileSync('test-reports/deployment-readiness-report.txt', report);
    fs.writeFileSync('test-reports/deployment-readiness-results.json', JSON.stringify(this.results, null, 2));

    console.log('📄 Deployment readiness report saved to: test-reports/deployment-readiness-report.txt');
    console.log('📄 Deployment readiness results (JSON) saved to: test-reports/deployment-readiness-results.json\n');
  }
}

// Run checks
const checker = new DeploymentChecker();
checker.runAllChecks().catch(console.error);




