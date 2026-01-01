#!/usr/bin/env node

/**
 * Quick verification script for backend testing and WebSocket features
 * Run this after npm install completes
 */

console.log('🚀 StudentHubConnect - Backend Verification\n');

// Check if required packages are installed
const requiredPackages = [
    'vitest',
    '@vitest/ui',
    'supertest',
    '@types/supertest',
];

console.log('📦 Checking dependencies...');
let allInstalled = true;

for (const pkg of requiredPackages) {
    try {
        require.resolve(pkg);
        console.log(`  ✅ ${pkg}`);
    } catch (e) {
        console.log(`  ❌ ${pkg} - NOT INSTALLED`);
        allInstalled = false;
    }
}

if (!allInstalled) {
    console.log('\n⚠️  Some dependencies are missing.');
    console.log('Run: npm install -D vitest @vitest/ui supertest @types/supertest\n');
    process.exit(1);
}

console.log('\n✅ All dependencies installed!\n');

console.log('📋 Next steps:');
console.log('  1. Run tests: npm test');
console.log('  2. Start server: npm run dev:server');
console.log('  3. Test WebSocket: Open browser console and connect');
console.log('  4. Check guide: TESTING_AND_REALTIME_GUIDE.md\n');

console.log('🎉 Ready to go!\n');
