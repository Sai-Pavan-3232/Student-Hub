import type { Express } from 'express';
import express from 'express';
import session from 'express-session';
import { registerRoutes } from './routes';
import { createServer } from 'http';
import type { InsertUser, InsertThread, InsertResource, InsertClub, InsertEvent } from '../shared/schema';

/**
 * Create a test Express app with all routes registered
 */
export async function createTestApp(): Promise<Express> {
    const app = express();
    const httpServer = createServer(app);

    // Session setup for tests
    app.use(
        session({
            secret: 'test-secret',
            resave: false,
            saveUninitialized: true,
            cookie: { secure: false },
        })
    );

    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    // Register all routes
    await registerRoutes(httpServer, app);

    return app;
}

/**
 * Test data factories
 */
export const testData = {
    user: (overrides?: Partial<InsertUser>): InsertUser => ({
        displayName: 'Test User',
        academicYear: 'sophomore',
        interests: ['Computer Science', 'AI'],
        isMentor: false,
        showOnline: true,
        allowMessages: true,
        showInDiscover: true,
        ...overrides,
    }),

    thread: (authorId: string, overrides?: Partial<InsertThread>) => ({
        title: 'Test Thread',
        content: 'This is a test thread content',
        category: 'academic',
        authorId,
        isAnonymous: false,
        ...overrides,
    }),

    resource: (authorId: string, overrides?: Partial<InsertResource>) => ({
        title: 'Test Resource',
        description: 'Test resource description',
        category: 'Study Materials',
        fileType: 'PDF',
        authorId,
        ...overrides,
    }),

    club: (overrides?: Partial<InsertClub>) => ({
        name: 'Test Club',
        description: 'Test club description',
        category: 'Technology',
        ...overrides,
    }),

    event: (overrides?: Partial<InsertEvent>) => ({
        title: 'Test Event',
        description: 'Test event description',
        date: '15 Dec',
        time: '10:00 AM',
        location: 'Test Location',
        clubId: null,
        ...overrides,
    }),
};

/**
 * Helper to create a test session with a user
 */
export function createTestSession(userId: string) {
    return {
        userId,
        cookie: {
            originalMaxAge: null,
            expires: null,
            secure: false,
            httpOnly: true,
            path: '/',
        },
    };
}

/**
 * Sleep utility for async tests
 */
export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Mock WebSocket for testing
 */
export class MockWebSocket {
    public messages: any[] = [];
    public readyState = 1; // OPEN

    send(data: string) {
        this.messages.push(JSON.parse(data));
    }

    close() {
        this.readyState = 3; // CLOSED
    }

    addEventListener(event: string, handler: Function) {
        // Mock implementation
    }

    removeEventListener(event: string, handler: Function) {
        // Mock implementation
    }
}
