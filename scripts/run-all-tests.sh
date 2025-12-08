#!/bin/bash

# Run all tests and generate comprehensive report

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║           COMPREHENSIVE TEST SUITE                           ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Create test reports directory
mkdir -p test-reports test-screenshots

echo "🔍 Step 1: Deployment Readiness Check..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
npm run test:deployment
echo ""

echo "🌐 Step 2: Browser Walkthrough Test..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
npm run test:browser
echo ""

echo "⚡ Step 3: Load Test..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
npm run test:load
echo ""

echo "✅ All tests completed!"
echo ""
echo "📄 Reports saved in: test-reports/"
echo "📸 Screenshots saved in: test-screenshots/"

