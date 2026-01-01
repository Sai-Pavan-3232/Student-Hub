const fs = require('fs');
const path = require('path');

console.log('🔍 Checking .env Configuration...\n');

// Read .env file
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
    console.log('❌ .env file not found!');
    process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const lines = envContent.split('\n');

// Check each required variable
const checks = {
    DATABASE_URL: {
        required: true,
        shouldStartWith: 'postgresql://',
        example: 'postgresql://postgres.ktwwwzcyebddkjgdskbd:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres'
    },
    SUPABASE_URL: {
        required: true,
        shouldStartWith: 'https://',
        example: 'https://ktwwwzcyebddkjgdskbd.supabase.co'
    },
    SUPABASE_ANON_KEY: {
        required: true,
        shouldStartWith: 'eyJ',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
    },
    SUPABASE_SERVICE_ROLE_KEY: {
        required: false,
        shouldStartWith: 'eyJ',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
    },
    SESSION_SECRET: {
        required: true,
        shouldStartWith: null,
        example: 'your-secret-key-here'
    }
};

let allGood = true;

for (const [key, config] of Object.entries(checks)) {
    const line = lines.find(l => l.trim().startsWith(`${key}=`));

    if (!line) {
        if (config.required) {
            console.log(`❌ ${key} - NOT FOUND`);
            console.log(`   Add: ${key}=${config.example}\n`);
            allGood = false;
        } else {
            console.log(`⚠️  ${key} - Not set (optional)`);
        }
        continue;
    }

    const value = line.split('=')[1]?.trim();

    if (!value || value === '') {
        console.log(`❌ ${key} - EMPTY`);
        console.log(`   Set to: ${config.example}\n`);
        allGood = false;
        continue;
    }

    if (config.shouldStartWith && !value.startsWith(config.shouldStartWith)) {
        console.log(`❌ ${key} - WRONG FORMAT`);
        console.log(`   Current: ${value.substring(0, 50)}...`);
        console.log(`   Should start with: ${config.shouldStartWith}`);
        console.log(`   Example: ${config.example}\n`);
        allGood = false;
        continue;
    }

    // Mask sensitive values
    let displayValue = value;
    if (key.includes('KEY') || key.includes('SECRET')) {
        displayValue = value.substring(0, 20) + '...' + value.substring(value.length - 10);
    } else if (key === 'DATABASE_URL') {
        // Mask password in DATABASE_URL
        displayValue = value.replace(/:([^@]+)@/, ':****@');
    }

    console.log(`✅ ${key}`);
    console.log(`   ${displayValue}\n`);
}

console.log('─'.repeat(60));

if (allGood) {
    console.log('✅ All environment variables are correctly configured!');
    console.log('\nNext steps:');
    console.log('1. Run: npm run migrate:push');
    console.log('2. Restart server: npm run dev:server');
} else {
    console.log('❌ Some environment variables need to be fixed.');
    console.log('\nPlease update your .env file with the correct values.');
    console.log('\nMost common issue:');
    console.log('DATABASE_URL should be the PostgreSQL connection string, not HTTPS URL');
    console.log('Format: postgresql://postgres.PROJECT:[PASSWORD]@HOST:6543/postgres');
}

console.log('─'.repeat(60));
