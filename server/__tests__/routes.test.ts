import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import type { Express } from 'express';
import { createTestApp, testData } from '../test-utils';

describe('API Routes', () => {
    let app: Express;
    let testUserId: string;

    beforeAll(async () => {
        app = await createTestApp();
    });

    describe('User Management', () => {
        it('GET /api/me - should return current user', async () => {
            const response = await request(app)
                .get('/api/me')
                .expect(200);

            expect(response.body).toHaveProperty('id');
            expect(response.body).toHaveProperty('displayName');
            testUserId = response.body.id;
        });

        it('PATCH /api/me - should update current user', async () => {
            const updates = {
                displayName: 'Updated Name',
                interests: ['Testing', 'Development'],
            };

            const response = await request(app)
                .patch('/api/me')
                .send(updates)
                .expect(200);

            expect(response.body.displayName).toBe('Updated Name');
            expect(response.body.interests).toContain('Testing');
        });

        it('GET /api/discover - should return discoverable users', async () => {
            const response = await request(app)
                .get('/api/discover')
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
        });
    });

    describe('Statistics', () => {
        it('GET /api/stats - should return platform statistics', async () => {
            const response = await request(app)
                .get('/api/stats')
                .expect(200);

            expect(response.body).toHaveProperty('activeUsers');
            expect(response.body).toHaveProperty('forumThreads');
            expect(response.body).toHaveProperty('activeMentors');
            expect(typeof response.body.activeUsers).toBe('number');
        });
    });

    describe('Threads', () => {
        let threadId: string;

        it('GET /api/threads - should list all threads', async () => {
            const response = await request(app)
                .get('/api/threads')
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            if (response.body.length > 0) {
                threadId = response.body[0].id;
            }
        });

        it('GET /api/threads?category=academic - should filter by category', async () => {
            const response = await request(app)
                .get('/api/threads?category=academic')
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            response.body.forEach((thread: any) => {
                expect(thread.category).toBe('academic');
            });
        });

        it('GET /api/threads?search=test - should search threads', async () => {
            const response = await request(app)
                .get('/api/threads?search=test')
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
        });

        it('POST /api/threads - should create a new thread', async () => {
            const newThread = {
                title: 'Test Thread',
                content: 'This is a test thread',
                category: 'academic',
                isAnonymous: true,
            };

            const response = await request(app)
                .post('/api/threads')
                .send(newThread)
                .expect(200);

            expect(response.body).toHaveProperty('id');
            expect(response.body.title).toBe(newThread.title);
            threadId = response.body.id;
        });

        it('GET /api/threads/:id - should get single thread', async () => {
            if (!threadId) {
                // Create a thread first
                const createResponse = await request(app)
                    .post('/api/threads')
                    .send({
                        title: 'Test Thread',
                        content: 'Content',
                        category: 'academic',
                        isAnonymous: false,
                    });
                threadId = createResponse.body.id;
            }

            const response = await request(app)
                .get(`/api/threads/${threadId}`)
                .expect(200);

            expect(response.body.id).toBe(threadId);
            expect(response.body).toHaveProperty('hasLiked');
        });

        it('POST /api/threads/:id/like - should toggle like on thread', async () => {
            if (!threadId) {
                const createResponse = await request(app)
                    .post('/api/threads')
                    .send({
                        title: 'Test Thread',
                        content: 'Content',
                        category: 'academic',
                        isAnonymous: false,
                    });
                threadId = createResponse.body.id;
            }

            const response = await request(app)
                .post(`/api/threads/${threadId}/like`)
                .expect(200);

            expect(response.body).toHaveProperty('likesCount');
        });

        it('POST /api/threads/:threadId/replies - should create a reply', async () => {
            if (!threadId) {
                const createResponse = await request(app)
                    .post('/api/threads')
                    .send({
                        title: 'Test Thread',
                        content: 'Content',
                        category: 'academic',
                        isAnonymous: false,
                    });
                threadId = createResponse.body.id;
            }

            const reply = {
                content: 'This is a test reply',
                isAnonymous: false,
            };

            const response = await request(app)
                .post(`/api/threads/${threadId}/replies`)
                .send(reply)
                .expect(200);

            expect(response.body.content).toBe(reply.content);
            expect(response.body.threadId).toBe(threadId);
        });

        it('GET /api/threads/:threadId/replies - should get thread replies', async () => {
            if (!threadId) {
                const createResponse = await request(app)
                    .post('/api/threads')
                    .send({
                        title: 'Test Thread',
                        content: 'Content',
                        category: 'academic',
                        isAnonymous: false,
                    });
                threadId = createResponse.body.id;
            }

            const response = await request(app)
                .get(`/api/threads/${threadId}/replies`)
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
        });
    });

    describe('Resources', () => {
        let resourceId: string;

        it('GET /api/resources - should list all resources', async () => {
            const response = await request(app)
                .get('/api/resources')
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
        });

        it('POST /api/resources - should create a new resource', async () => {
            const newResource = {
                title: 'Test Resource',
                description: 'Test description',
                category: 'Study Materials',
                fileType: 'PDF',
            };

            const response = await request(app)
                .post('/api/resources')
                .send(newResource)
                .expect(200);

            expect(response.body.title).toBe(newResource.title);
            resourceId = response.body.id;
        });

        it('GET /api/resources/:id - should get single resource', async () => {
            if (!resourceId) {
                const createResponse = await request(app)
                    .post('/api/resources')
                    .send({
                        title: 'Test Resource',
                        description: 'Test',
                        category: 'Study Materials',
                        fileType: 'PDF',
                    });
                resourceId = createResponse.body.id;
            }

            const response = await request(app)
                .get(`/api/resources/${resourceId}`)
                .expect(200);

            expect(response.body.id).toBe(resourceId);
        });

        it('POST /api/resources/:id/rate - should rate a resource', async () => {
            if (!resourceId) {
                const createResponse = await request(app)
                    .post('/api/resources')
                    .send({
                        title: 'Test Resource',
                        description: 'Test',
                        category: 'Study Materials',
                        fileType: 'PDF',
                    });
                resourceId = createResponse.body.id;
            }

            const response = await request(app)
                .post(`/api/resources/${resourceId}/rate`)
                .send({ rating: 5 })
                .expect(200);

            expect(response.body).toHaveProperty('rating');
        });

        it('POST /api/resources/:id/download - should increment downloads', async () => {
            if (!resourceId) {
                const createResponse = await request(app)
                    .post('/api/resources')
                    .send({
                        title: 'Test Resource',
                        description: 'Test',
                        category: 'Study Materials',
                        fileType: 'PDF',
                    });
                resourceId = createResponse.body.id;
            }

            const response = await request(app)
                .post(`/api/resources/${resourceId}/download`)
                .expect(200);

            expect(response.body).toHaveProperty('downloads');
        });
    });

    describe('Mentors', () => {
        let mentorId: string;

        it('GET /api/mentors - should list all mentors', async () => {
            const response = await request(app)
                .get('/api/mentors')
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
        });

        it('POST /api/mentors - should create mentor profile', async () => {
            const mentorProfile = {
                bio: 'Test mentor bio',
                expertise: ['Testing', 'Development'],
                availability: 'Weekdays 9-5',
            };

            const response = await request(app)
                .post('/api/mentors')
                .send(mentorProfile)
                .expect(200);

            expect(response.body.bio).toBe(mentorProfile.bio);
            mentorId = response.body.id;
        });

        it('GET /api/mentors/:id - should get mentor profile', async () => {
            if (!mentorId) {
                const createResponse = await request(app)
                    .post('/api/mentors')
                    .send({
                        bio: 'Test',
                        expertise: ['Testing'],
                        availability: 'Weekdays',
                    });
                mentorId = createResponse.body.id;
            }

            const response = await request(app)
                .get(`/api/mentors/${mentorId}`)
                .expect(200);

            expect(response.body.id).toBe(mentorId);
        });

        it('POST /api/mentors/:id/request - should create mentorship request', async () => {
            if (!mentorId) {
                const createResponse = await request(app)
                    .post('/api/mentors')
                    .send({
                        bio: 'Test',
                        expertise: ['Testing'],
                        availability: 'Weekdays',
                    });
                mentorId = createResponse.body.id;
            }

            const response = await request(app)
                .post(`/api/mentors/${mentorId}/request`)
                .send({ message: 'I would like mentorship' })
                .expect(200);

            expect(response.body).toHaveProperty('mentorProfileId');
            expect(response.body.status).toBe('pending');
        });
    });

    describe('Clubs', () => {
        let clubId: string;

        it('GET /api/clubs - should list all clubs', async () => {
            const response = await request(app)
                .get('/api/clubs')
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
        });

        it('POST /api/clubs - should create a new club', async () => {
            const newClub = {
                name: 'Test Club',
                description: 'Test club description',
                category: 'Technology',
            };

            const response = await request(app)
                .post('/api/clubs')
                .send(newClub)
                .expect(200);

            expect(response.body.name).toBe(newClub.name);
            clubId = response.body.id;
        });

        it('GET /api/clubs/:id - should get club details', async () => {
            if (!clubId) {
                const createResponse = await request(app)
                    .post('/api/clubs')
                    .send({
                        name: 'Test Club',
                        description: 'Test',
                        category: 'Technology',
                    });
                clubId = createResponse.body.id;
            }

            const response = await request(app)
                .get(`/api/clubs/${clubId}`)
                .expect(200);

            expect(response.body.id).toBe(clubId);
            expect(response.body).toHaveProperty('isMember');
        });

        it('POST /api/clubs/:id/join - should toggle club membership', async () => {
            if (!clubId) {
                const createResponse = await request(app)
                    .post('/api/clubs')
                    .send({
                        name: 'Test Club',
                        description: 'Test',
                        category: 'Technology',
                    });
                clubId = createResponse.body.id;
            }

            const response = await request(app)
                .post(`/api/clubs/${clubId}/join`)
                .expect(200);

            expect(response.body).toHaveProperty('isMember');
        });
    });

    describe('Events', () => {
        let eventId: string;

        it('GET /api/events - should list all events', async () => {
            const response = await request(app)
                .get('/api/events')
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
        });

        it('POST /api/events - should create a new event', async () => {
            const newEvent = {
                title: 'Test Event',
                description: 'Test event description',
                date: '15 Dec',
                time: '10:00 AM',
                location: 'Test Location',
            };

            const response = await request(app)
                .post('/api/events')
                .send(newEvent)
                .expect(200);

            expect(response.body.title).toBe(newEvent.title);
            eventId = response.body.id;
        });

        it('GET /api/events/:id - should get event details', async () => {
            if (!eventId) {
                const createResponse = await request(app)
                    .post('/api/events')
                    .send({
                        title: 'Test Event',
                        description: 'Test',
                        date: '15 Dec',
                        time: '10:00 AM',
                        location: 'Test Location',
                    });
                eventId = createResponse.body.id;
            }

            const response = await request(app)
                .get(`/api/events/${eventId}`)
                .expect(200);

            expect(response.body.id).toBe(eventId);
            expect(response.body).toHaveProperty('isRegistered');
        });

        it('POST /api/events/:id/register - should toggle event registration', async () => {
            if (!eventId) {
                const createResponse = await request(app)
                    .post('/api/events')
                    .send({
                        title: 'Test Event',
                        description: 'Test',
                        date: '15 Dec',
                        time: '10:00 AM',
                        location: 'Test Location',
                    });
                eventId = createResponse.body.id;
            }

            const response = await request(app)
                .post(`/api/events/${eventId}/register`)
                .expect(200);

            expect(response.body).toHaveProperty('isRegistered');
        });
    });

    describe('Connections', () => {
        it('GET /api/connections - should list user connections', async () => {
            const response = await request(app)
                .get('/api/connections')
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
        });

        it('POST /api/connections - should create connection request', async () => {
            // First get a user to connect with
            const discoverResponse = await request(app).get('/api/discover');

            if (discoverResponse.body.length > 0) {
                const targetUser = discoverResponse.body[0];

                const response = await request(app)
                    .post('/api/connections')
                    .send({ targetId: targetUser.id })
                    .expect(200);

                // Check that we got a connection object back
                expect(response.body).toHaveProperty('id');
                expect(response.body).toHaveProperty('requesterId');
                expect(response.body).toHaveProperty('targetId');
            }
        });
    });

    describe('Todos', () => {
        let todoId: string;

        it('GET /api/todos - should list user todos', async () => {
            const response = await request(app)
                .get('/api/todos')
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
        });

        it('POST /api/todos - should create a new todo', async () => {
            const response = await request(app)
                .post('/api/todos')
                .send({ text: 'Test todo item' })
                .expect(200);

            expect(response.body.text).toBe('Test todo item');
            expect(response.body.completed).toBe(false);
            todoId = response.body.id;
        });

        it('PATCH /api/todos/:id - should update todo completion', async () => {
            if (!todoId) {
                const createResponse = await request(app)
                    .post('/api/todos')
                    .send({ text: 'Test todo' });
                todoId = createResponse.body.id;
            }

            const response = await request(app)
                .patch(`/api/todos/${todoId}`)
                .send({ completed: true })
                .expect(200);

            expect(response.body.completed).toBe(true);
        });

        it('DELETE /api/todos/:id - should delete todo', async () => {
            if (!todoId) {
                const createResponse = await request(app)
                    .post('/api/todos')
                    .send({ text: 'Test todo' });
                todoId = createResponse.body.id;
            }

            const response = await request(app)
                .delete(`/api/todos/${todoId}`)
                .expect(200);

            expect(response.body.success).toBe(true);
        });
    });
});
