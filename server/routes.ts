import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertThreadSchema, insertReplySchema, insertResourceSchema,
  insertMentorProfileSchema, insertMentorshipRequestSchema, insertClubSchema,
  insertEventSchema, insertConnectionSchema, insertTodoSchema, insertUserSchema
} from "../shared/schema";
import { z } from "zod";
import supabaseAdmin from './supabase';
import { wsManager, createNotification } from './websocket';

const ENABLE_ADMIN_ROUTES = process.env.ENABLE_ADMIN_ROUTES === 'true';


export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Session middleware - create anonymous user if not exists
  app.use(async (req, res, next) => {
    if (!req.session.userId) {
      const user = await storage.createUser({
        displayName: "Anonymous Student",
        academicYear: "freshman",
        interests: [],
      });
      req.session.userId = user.id;
    }
    next();
  });

  // Get current user
  app.get("/api/me", async (req, res) => {
    const user = await storage.getUser(req.session.userId!);
    res.json(user);
  });

  // Update current user
  app.patch("/api/me", async (req, res) => {
    const data = insertUserSchema.partial().parse(req.body);
    const user = await storage.updateUser(req.session.userId!, data);
    res.json(user);
  });

  // Stats
  app.get("/api/stats", async (req, res) => {
    const stats = await storage.getStats();
    res.json(stats);
  });

  // Threads
  app.get("/api/threads", async (req, res) => {
    const { category, search } = req.query;
    const threads = await storage.getThreads(
      category as string | undefined,
      search as string | undefined
    );
    res.json(threads);
  });

  // Admin-only routes (disabled by default). Enable with `ENABLE_ADMIN_ROUTES=true` and provide SUPABASE_SERVICE_ROLE_KEY.
  if (ENABLE_ADMIN_ROUTES) {
    app.get('/api/admin/users', async (req, res) => {
      if (!supabaseAdmin) return res.status(503).json({ error: 'Supabase admin client not configured.' });
      try {
        const { data, error } = await supabaseAdmin.auth.admin.listUsers({ perPage: 100 });
        if (error) return res.status(500).json({ error: error.message });
        res.json({ users: data });
      } catch (err: any) {
        res.status(500).json({ error: err?.message || String(err) });
      }
    });

    app.get('/api/admin/stats', async (req, res) => {
      // Example: combine Supabase admin info with local stats
      if (!supabaseAdmin) return res.status(503).json({ error: 'Supabase admin client not configured.' });
      try {
        const stats = await storage.getStats();
        const { data, error } = await supabaseAdmin.functions.invoke('health-check').catch(() => ({ data: null, error: null }));
        // We don't fail if function not present; just include what we can
        res.json({ stats, remote: data || null });
      } catch (err: any) {
        res.status(500).json({ error: err?.message || String(err) });
      }
    });
  }

  app.get("/api/threads/:id", async (req, res) => {
    const thread = await storage.getThread(req.params.id);
    if (!thread) {
      return res.status(404).json({ error: "Thread not found" });
    }
    const hasLiked = await storage.hasUserLikedThread(req.params.id, req.session.userId!);
    res.json({ ...thread, hasLiked });
  });

  app.post("/api/threads", async (req, res) => {
    const data = insertThreadSchema.parse({
      ...req.body,
      authorId: req.session.userId,
    });
    const thread = await storage.createThread(data);
    res.json(thread);
  });

  app.post("/api/threads/:id/like", async (req, res) => {
    const hasLiked = await storage.hasUserLikedThread(req.params.id, req.session.userId!);
    if (hasLiked) {
      await storage.unlikeThread(req.params.id, req.session.userId!);
    } else {
      await storage.likeThread(req.params.id, req.session.userId!);
    }
    const thread = await storage.getThread(req.params.id);
    res.json(thread);
  });

  // Replies
  app.get("/api/threads/:threadId/replies", async (req, res) => {
    const replies = await storage.getReplies(req.params.threadId);
    res.json(replies);
  });

  app.post("/api/threads/:threadId/replies", async (req, res) => {
    const data = insertReplySchema.parse({
      ...req.body,
      threadId: req.params.threadId,
      authorId: req.session.userId,
    });
    const reply = await storage.createReply(data);

    // Send real-time notification to thread author
    const thread = await storage.getThread(req.params.threadId);
    if (thread && thread.authorId !== req.session.userId) {
      const author = await storage.getUser(req.session.userId!);
      const notification = createNotification(
        'thread_reply',
        thread.authorId,
        'New Reply',
        `${author?.displayName || 'Someone'} replied to your thread`,
        {
          threadId: thread.id,
          threadTitle: thread.title,
          replyId: reply.id,
          authorId: req.session.userId!,
          authorName: author?.displayName || 'Anonymous',
        }
      );
      wsManager.sendNotificationToUser(thread.authorId, notification);
    }

    res.json(reply);
  });

  // Resources
  app.get("/api/resources", async (req, res) => {
    const { category, search } = req.query;
    const resources = await storage.getResources(
      category as string | undefined,
      search as string | undefined
    );
    res.json(resources);
  });

  app.get("/api/resources/:id", async (req, res) => {
    const resource = await storage.getResource(req.params.id);
    if (!resource) {
      return res.status(404).json({ error: "Resource not found" });
    }
    res.json(resource);
  });

  app.post("/api/resources", async (req, res) => {
    const data = insertResourceSchema.parse({
      ...req.body,
      authorId: req.session.userId,
    });
    const resource = await storage.createResource(data);
    res.json(resource);
  });

  app.post("/api/resources/:id/rate", async (req, res) => {
    const { rating } = z.object({ rating: z.number().min(1).max(5) }).parse(req.body);
    await storage.rateResource(req.params.id, req.session.userId!, rating);
    const resource = await storage.getResource(req.params.id);
    res.json(resource);
  });

  app.post("/api/resources/:id/download", async (req, res) => {
    await storage.incrementDownloads(req.params.id);
    const resource = await storage.getResource(req.params.id);
    res.json(resource);
  });

  // Mentors
  app.get("/api/mentors", async (req, res) => {
    const mentors = await storage.getMentorProfiles();
    res.json(mentors);
  });

  app.get("/api/mentors/:id", async (req, res) => {
    const mentor = await storage.getMentorProfile(req.params.id);
    if (!mentor) {
      return res.status(404).json({ error: "Mentor not found" });
    }
    res.json(mentor);
  });

  app.post("/api/mentors", async (req, res) => {
    const data = insertMentorProfileSchema.parse({
      ...req.body,
      userId: req.session.userId,
    });
    const mentor = await storage.createMentorProfile(data);
    res.json(mentor);
  });

  app.post("/api/mentors/:id/request", async (req, res) => {
    const data = insertMentorshipRequestSchema.parse({
      mentorProfileId: req.params.id,
      studentId: req.session.userId,
      message: req.body.message,
    });
    const request = await storage.requestMentorship(data);

    // Send real-time notification to mentor
    const mentorProfile = await storage.getMentorProfile(req.params.id);
    if (mentorProfile) {
      const student = await storage.getUser(req.session.userId!);
      const notification = createNotification(
        'mentorship_request',
        mentorProfile.userId,
        'New Mentorship Request',
        `${student?.displayName || 'A student'} requested mentorship`,
        {
          requestId: request.id,
          studentId: req.session.userId!,
          studentName: student?.displayName || 'Anonymous',
          message: req.body.message,
        }
      );
      wsManager.sendNotificationToUser(mentorProfile.userId, notification);
    }

    res.json(request);
  });

  // Clubs
  app.get("/api/clubs", async (req, res) => {
    const { search } = req.query;
    const clubs = await storage.getClubs(search as string | undefined);

    // Check membership status for each club
    const clubsWithStatus = await Promise.all(
      clubs.map(async (club) => ({
        ...club,
        isMember: await storage.isUserInClub(club.id, req.session.userId!),
      }))
    );
    res.json(clubsWithStatus);
  });

  app.get("/api/clubs/:id", async (req, res) => {
    const club = await storage.getClub(req.params.id);
    if (!club) {
      return res.status(404).json({ error: "Club not found" });
    }
    const isMember = await storage.isUserInClub(req.params.id, req.session.userId!);
    res.json({ ...club, isMember });
  });

  app.post("/api/clubs", async (req, res) => {
    const data = insertClubSchema.parse(req.body);
    const club = await storage.createClub(data);
    res.json(club);
  });

  app.post("/api/clubs/:id/join", async (req, res) => {
    const isMember = await storage.isUserInClub(req.params.id, req.session.userId!);
    if (isMember) {
      await storage.leaveClub(req.params.id, req.session.userId!);
    } else {
      await storage.joinClub(req.params.id, req.session.userId!);
    }
    const club = await storage.getClub(req.params.id);
    res.json({ ...club, isMember: !isMember });
  });

  // Events
  app.get("/api/events", async (req, res) => {
    const { search } = req.query;
    const events = await storage.getEvents(search as string | undefined);

    // Check registration status for each event
    const eventsWithStatus = await Promise.all(
      events.map(async (event) => ({
        ...event,
        isRegistered: await storage.isUserRegisteredForEvent(event.id, req.session.userId!),
      }))
    );
    res.json(eventsWithStatus);
  });

  app.get("/api/events/:id", async (req, res) => {
    const event = await storage.getEvent(req.params.id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    const isRegistered = await storage.isUserRegisteredForEvent(req.params.id, req.session.userId!);
    res.json({ ...event, isRegistered });
  });

  app.post("/api/events", async (req, res) => {
    const data = insertEventSchema.parse(req.body);
    const event = await storage.createEvent(data);
    res.json(event);
  });

  app.post("/api/events/:id/register", async (req, res) => {
    const isRegistered = await storage.isUserRegisteredForEvent(req.params.id, req.session.userId!);
    if (isRegistered) {
      await storage.unregisterFromEvent(req.params.id, req.session.userId!);
    } else {
      await storage.registerForEvent(req.params.id, req.session.userId!);
    }
    const event = await storage.getEvent(req.params.id);
    res.json({ ...event, isRegistered: !isRegistered });
  });

  // Discover / Users
  app.get("/api/discover", async (req, res) => {
    const users = await storage.getDiscoverableUsers(req.session.userId);
    res.json(users);
  });

  // Connections
  app.get("/api/connections", async (req, res) => {
    const connections = await storage.getConnections(req.session.userId!);
    res.json(connections);
  });

  app.post("/api/connections", async (req, res) => {
    const data = insertConnectionSchema.parse({
      requesterId: req.session.userId,
      targetId: req.body.targetId,
    });
    const connection = await storage.createConnection(data);

    // Send real-time notification to target user
    const requester = await storage.getUser(req.session.userId!);
    const notification = createNotification(
      'connection_request',
      req.body.targetId,
      'New Connection Request',
      `${requester?.displayName || 'Someone'} wants to connect with you`,
      {
        requesterId: req.session.userId!,
        requesterName: requester?.displayName || 'Anonymous',
        connectionId: connection.id,
      }
    );
    wsManager.sendNotificationToUser(req.body.targetId, notification);

    res.json(connection);
  });

  app.patch("/api/connections/:id", async (req, res) => {
    const { status } = z.object({ status: z.enum(["accepted", "declined"]) }).parse(req.body);
    const connection = await storage.updateConnectionStatus(req.params.id, status);

    // Send notification if accepted
    if (status === 'accepted' && connection) {
      const accepter = await storage.getUser(req.session.userId!);
      const notification = createNotification(
        'connection_accepted',
        connection.requesterId,
        'Connection Accepted',
        `${accepter?.displayName || 'Someone'} accepted your connection request`,
        {
          accepterId: req.session.userId!,
          accepterName: accepter?.displayName || 'Anonymous',
          connectionId: connection.id,
        }
      );
      wsManager.sendNotificationToUser(connection.requesterId, notification);
    }

    res.json(connection);
  });

  // Todos
  app.get("/api/todos", async (req, res) => {
    const todos = await storage.getTodos(req.session.userId!);
    res.json(todos);
  });

  app.post("/api/todos", async (req, res) => {
    const data = insertTodoSchema.parse({
      userId: req.session.userId,
      text: req.body.text,
    });
    const todo = await storage.createTodo(data);
    res.json(todo);
  });

  app.patch("/api/todos/:id", async (req, res) => {
    const { completed } = z.object({ completed: z.boolean() }).parse(req.body);
    const todo = await storage.updateTodo(req.params.id, completed);
    res.json(todo);
  });

  app.delete("/api/todos/:id", async (req, res) => {
    await storage.deleteTodo(req.params.id);
    res.json({ success: true });
  });

  return httpServer;
}
