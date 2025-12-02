import { eq, desc, and, sql, ilike, or } from "drizzle-orm";
import { db } from "./db";
import {
  users, threads, replies, threadLikes, resources, resourceRatings,
  mentorProfiles, mentorshipRequests, clubs, clubMembers, events, eventAttendees,
  connections, todos,
  type User, type InsertUser,
  type Thread, type InsertThread,
  type Reply, type InsertReply,
  type Resource, type InsertResource,
  type MentorProfile, type InsertMentorProfile,
  type MentorshipRequest, type InsertMentorshipRequest,
  type Club, type InsertClub,
  type Event, type InsertEvent,
  type Connection, type InsertConnection,
  type Todo, type InsertTodo,
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, data: Partial<InsertUser>): Promise<User | undefined>;
  getDiscoverableUsers(excludeUserId?: string): Promise<User[]>;

  // Threads
  getThreads(category?: string, search?: string): Promise<Thread[]>;
  getThread(id: string): Promise<Thread | undefined>;
  createThread(thread: InsertThread): Promise<Thread>;
  likeThread(threadId: string, userId: string): Promise<void>;
  unlikeThread(threadId: string, userId: string): Promise<void>;
  hasUserLikedThread(threadId: string, userId: string): Promise<boolean>;

  // Replies
  getReplies(threadId: string): Promise<Reply[]>;
  createReply(reply: InsertReply): Promise<Reply>;

  // Resources
  getResources(category?: string, search?: string): Promise<Resource[]>;
  getResource(id: string): Promise<Resource | undefined>;
  createResource(resource: InsertResource): Promise<Resource>;
  rateResource(resourceId: string, userId: string, rating: number): Promise<void>;
  incrementDownloads(resourceId: string): Promise<void>;

  // Mentors
  getMentorProfiles(): Promise<(MentorProfile & { user: User })[]>;
  getMentorProfile(id: string): Promise<MentorProfile | undefined>;
  createMentorProfile(profile: InsertMentorProfile): Promise<MentorProfile>;
  requestMentorship(request: InsertMentorshipRequest): Promise<MentorshipRequest>;
  getMentorshipRequests(mentorProfileId: string): Promise<MentorshipRequest[]>;
  updateMentorshipRequest(id: string, status: string): Promise<MentorshipRequest | undefined>;

  // Clubs
  getClubs(search?: string): Promise<Club[]>;
  getClub(id: string): Promise<Club | undefined>;
  createClub(club: InsertClub): Promise<Club>;
  joinClub(clubId: string, userId: string): Promise<void>;
  leaveClub(clubId: string, userId: string): Promise<void>;
  isUserInClub(clubId: string, userId: string): Promise<boolean>;

  // Events
  getEvents(search?: string): Promise<Event[]>;
  getEvent(id: string): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  registerForEvent(eventId: string, userId: string): Promise<void>;
  unregisterFromEvent(eventId: string, userId: string): Promise<void>;
  isUserRegisteredForEvent(eventId: string, userId: string): Promise<boolean>;

  // Connections
  createConnection(connection: InsertConnection): Promise<Connection>;
  getConnections(userId: string): Promise<Connection[]>;
  updateConnectionStatus(id: string, status: string): Promise<Connection | undefined>;

  // Todos
  getTodos(userId: string): Promise<Todo[]>;
  createTodo(todo: InsertTodo): Promise<Todo>;
  updateTodo(id: string, completed: boolean): Promise<Todo | undefined>;
  deleteTodo(id: string): Promise<void>;

  // Stats
  getStats(): Promise<{ activeUsers: number; forumThreads: number; activeMentors: number }>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async updateUser(id: string, data: Partial<InsertUser>): Promise<User | undefined> {
    const [updated] = await db.update(users).set(data).where(eq(users.id, id)).returning();
    return updated;
  }

  async getDiscoverableUsers(excludeUserId?: string): Promise<User[]> {
    if (excludeUserId) {
      return db.select().from(users).where(and(eq(users.showInDiscover, true), sql`${users.id} != ${excludeUserId}`));
    }
    return db.select().from(users).where(eq(users.showInDiscover, true));
  }

  // Threads
  async getThreads(category?: string, search?: string): Promise<Thread[]> {
    let query = db.select().from(threads).orderBy(desc(threads.createdAt));
    
    if (category && category !== "all") {
      return db.select().from(threads).where(eq(threads.category, category)).orderBy(desc(threads.createdAt));
    }
    if (search) {
      return db.select().from(threads).where(
        or(ilike(threads.title, `%${search}%`), ilike(threads.content, `%${search}%`))
      ).orderBy(desc(threads.createdAt));
    }
    return query;
  }

  async getThread(id: string): Promise<Thread | undefined> {
    const [thread] = await db.select().from(threads).where(eq(threads.id, id));
    return thread;
  }

  async createThread(thread: InsertThread): Promise<Thread> {
    const [newThread] = await db.insert(threads).values(thread).returning();
    return newThread;
  }

  async likeThread(threadId: string, userId: string): Promise<void> {
    await db.insert(threadLikes).values({ threadId, userId });
    await db.update(threads).set({ likesCount: sql`${threads.likesCount} + 1` }).where(eq(threads.id, threadId));
  }

  async unlikeThread(threadId: string, userId: string): Promise<void> {
    await db.delete(threadLikes).where(and(eq(threadLikes.threadId, threadId), eq(threadLikes.userId, userId)));
    await db.update(threads).set({ likesCount: sql`${threads.likesCount} - 1` }).where(eq(threads.id, threadId));
  }

  async hasUserLikedThread(threadId: string, userId: string): Promise<boolean> {
    const [like] = await db.select().from(threadLikes).where(and(eq(threadLikes.threadId, threadId), eq(threadLikes.userId, userId)));
    return !!like;
  }

  // Replies
  async getReplies(threadId: string): Promise<Reply[]> {
    return db.select().from(replies).where(eq(replies.threadId, threadId)).orderBy(desc(replies.createdAt));
  }

  async createReply(reply: InsertReply): Promise<Reply> {
    const [newReply] = await db.insert(replies).values(reply).returning();
    return newReply;
  }

  // Resources
  async getResources(category?: string, search?: string): Promise<Resource[]> {
    if (category && category !== "all") {
      return db.select().from(resources).where(eq(resources.category, category)).orderBy(desc(resources.createdAt));
    }
    if (search) {
      return db.select().from(resources).where(
        or(ilike(resources.title, `%${search}%`), ilike(resources.description, `%${search}%`))
      ).orderBy(desc(resources.createdAt));
    }
    return db.select().from(resources).orderBy(desc(resources.createdAt));
  }

  async getResource(id: string): Promise<Resource | undefined> {
    const [resource] = await db.select().from(resources).where(eq(resources.id, id));
    return resource;
  }

  async createResource(resource: InsertResource): Promise<Resource> {
    const [newResource] = await db.insert(resources).values(resource).returning();
    return newResource;
  }

  async rateResource(resourceId: string, userId: string, rating: number): Promise<void> {
    const existingRating = await db.select().from(resourceRatings).where(
      and(eq(resourceRatings.resourceId, resourceId), eq(resourceRatings.userId, userId))
    );
    
    if (existingRating.length > 0) {
      await db.update(resourceRatings).set({ rating }).where(eq(resourceRatings.id, existingRating[0].id));
    } else {
      await db.insert(resourceRatings).values({ resourceId, userId, rating });
      await db.update(resources).set({ ratingCount: sql`${resources.ratingCount} + 1` }).where(eq(resources.id, resourceId));
    }
    
    // Recalculate average rating
    const ratings = await db.select().from(resourceRatings).where(eq(resourceRatings.resourceId, resourceId));
    const avg = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
    await db.update(resources).set({ rating: avg }).where(eq(resources.id, resourceId));
  }

  async incrementDownloads(resourceId: string): Promise<void> {
    await db.update(resources).set({ downloads: sql`${resources.downloads} + 1` }).where(eq(resources.id, resourceId));
  }

  // Mentors
  async getMentorProfiles(): Promise<(MentorProfile & { user: User })[]> {
    const profiles = await db.select().from(mentorProfiles).orderBy(desc(mentorProfiles.rating));
    const result: (MentorProfile & { user: User })[] = [];
    
    for (const profile of profiles) {
      const [user] = await db.select().from(users).where(eq(users.id, profile.userId));
      if (user) {
        result.push({ ...profile, user });
      }
    }
    return result;
  }

  async getMentorProfile(id: string): Promise<MentorProfile | undefined> {
    const [profile] = await db.select().from(mentorProfiles).where(eq(mentorProfiles.id, id));
    return profile;
  }

  async createMentorProfile(profile: InsertMentorProfile): Promise<MentorProfile> {
    const [newProfile] = await db.insert(mentorProfiles).values(profile).returning();
    await db.update(users).set({ isMentor: true }).where(eq(users.id, profile.userId));
    return newProfile;
  }

  async requestMentorship(request: InsertMentorshipRequest): Promise<MentorshipRequest> {
    const [newRequest] = await db.insert(mentorshipRequests).values(request).returning();
    return newRequest;
  }

  async getMentorshipRequests(mentorProfileId: string): Promise<MentorshipRequest[]> {
    return db.select().from(mentorshipRequests).where(eq(mentorshipRequests.mentorProfileId, mentorProfileId));
  }

  async updateMentorshipRequest(id: string, status: string): Promise<MentorshipRequest | undefined> {
    const [updated] = await db.update(mentorshipRequests).set({ status, updatedAt: new Date() }).where(eq(mentorshipRequests.id, id)).returning();
    return updated;
  }

  // Clubs
  async getClubs(search?: string): Promise<Club[]> {
    if (search) {
      return db.select().from(clubs).where(
        or(ilike(clubs.name, `%${search}%`), ilike(clubs.description, `%${search}%`))
      ).orderBy(desc(clubs.membersCount));
    }
    return db.select().from(clubs).orderBy(desc(clubs.membersCount));
  }

  async getClub(id: string): Promise<Club | undefined> {
    const [club] = await db.select().from(clubs).where(eq(clubs.id, id));
    return club;
  }

  async createClub(club: InsertClub): Promise<Club> {
    const [newClub] = await db.insert(clubs).values(club).returning();
    return newClub;
  }

  async joinClub(clubId: string, userId: string): Promise<void> {
    await db.insert(clubMembers).values({ clubId, userId });
    await db.update(clubs).set({ membersCount: sql`${clubs.membersCount} + 1` }).where(eq(clubs.id, clubId));
  }

  async leaveClub(clubId: string, userId: string): Promise<void> {
    await db.delete(clubMembers).where(and(eq(clubMembers.clubId, clubId), eq(clubMembers.userId, userId)));
    await db.update(clubs).set({ membersCount: sql`${clubs.membersCount} - 1` }).where(eq(clubs.id, clubId));
  }

  async isUserInClub(clubId: string, userId: string): Promise<boolean> {
    const [member] = await db.select().from(clubMembers).where(and(eq(clubMembers.clubId, clubId), eq(clubMembers.userId, userId)));
    return !!member;
  }

  // Events
  async getEvents(search?: string): Promise<Event[]> {
    if (search) {
      return db.select().from(events).where(
        or(ilike(events.title, `%${search}%`), ilike(events.description, `%${search}%`))
      ).orderBy(desc(events.createdAt));
    }
    return db.select().from(events).orderBy(desc(events.createdAt));
  }

  async getEvent(id: string): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event;
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const [newEvent] = await db.insert(events).values(event).returning();
    return newEvent;
  }

  async registerForEvent(eventId: string, userId: string): Promise<void> {
    await db.insert(eventAttendees).values({ eventId, userId });
    await db.update(events).set({ attendingCount: sql`${events.attendingCount} + 1` }).where(eq(events.id, eventId));
  }

  async unregisterFromEvent(eventId: string, userId: string): Promise<void> {
    await db.delete(eventAttendees).where(and(eq(eventAttendees.eventId, eventId), eq(eventAttendees.userId, userId)));
    await db.update(events).set({ attendingCount: sql`${events.attendingCount} - 1` }).where(eq(events.id, eventId));
  }

  async isUserRegisteredForEvent(eventId: string, userId: string): Promise<boolean> {
    const [attendee] = await db.select().from(eventAttendees).where(and(eq(eventAttendees.eventId, eventId), eq(eventAttendees.userId, userId)));
    return !!attendee;
  }

  // Connections
  async createConnection(connection: InsertConnection): Promise<Connection> {
    const [newConnection] = await db.insert(connections).values(connection).returning();
    return newConnection;
  }

  async getConnections(userId: string): Promise<Connection[]> {
    return db.select().from(connections).where(
      or(eq(connections.requesterId, userId), eq(connections.targetId, userId))
    );
  }

  async updateConnectionStatus(id: string, status: string): Promise<Connection | undefined> {
    const [updated] = await db.update(connections).set({ status }).where(eq(connections.id, id)).returning();
    return updated;
  }

  // Todos
  async getTodos(userId: string): Promise<Todo[]> {
    return db.select().from(todos).where(eq(todos.userId, userId)).orderBy(desc(todos.createdAt));
  }

  async createTodo(todo: InsertTodo): Promise<Todo> {
    const [newTodo] = await db.insert(todos).values(todo).returning();
    return newTodo;
  }

  async updateTodo(id: string, completed: boolean): Promise<Todo | undefined> {
    const [updated] = await db.update(todos).set({ completed }).where(eq(todos.id, id)).returning();
    return updated;
  }

  async deleteTodo(id: string): Promise<void> {
    await db.delete(todos).where(eq(todos.id, id));
  }

  // Stats
  async getStats(): Promise<{ activeUsers: number; forumThreads: number; activeMentors: number }> {
    const [userCount] = await db.select({ count: sql<number>`count(*)` }).from(users);
    const [threadCount] = await db.select({ count: sql<number>`count(*)` }).from(threads);
    const [mentorCount] = await db.select({ count: sql<number>`count(*)` }).from(mentorProfiles);
    
    return {
      activeUsers: Number(userCount?.count) || 0,
      forumThreads: Number(threadCount?.count) || 0,
      activeMentors: Number(mentorCount?.count) || 0,
    };
  }
}

export const storage = new DatabaseStorage();
