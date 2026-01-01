import { beforeAll, afterAll, afterEach } from 'vitest';

// Setup runs before all tests
beforeAll(() => {
    // Set test environment variables
    process.env.NODE_ENV = 'test';
    process.env.USE_MOCK_DB = 'true';
    process.env.SESSION_SECRET = 'test-secret-key';
    process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test'; // Dummy URL for tests
});

// Cleanup after each test
afterEach(() => {
    // Clear any test-specific state
});

// Cleanup after all tests
afterAll(() => {
    // Final cleanup
});
