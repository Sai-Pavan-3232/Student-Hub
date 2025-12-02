// @ts-nocheck
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

// Simple in-memory mock storage used when no real database is available.
class MockStorage implements IStorage {
  private users: User[] = [];
  private threads: Thread[] = [];
  private replies: Reply[] = [];
  private resources: Resource[] = [];
  private mentorProfiles: MentorProfile[] = [];
  private mentorshipRequests: MentorshipRequest[] = [];
  private clubs: Club[] = [];
  private events: Event[] = [];
  private connections: Connection[] = [];
  private todos: Todo[] = [];
  private threadLikesSet = new Set<string>(); // stored as `${threadId}:${userId}`

  private makeId(prefix = '') {
    return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2,8)}`;
  }

  constructor() {
    // seed default mock data asynchronously
    (async () => {
      try {
        await this.seedDefaultData();
      } catch (e) {
        // ignore seed errors in constructor
        console.error('MockStorage seed error:', e);
      }
    })();
  }

  private async seedDefaultData() {
    if (this.users.length > 0) return; // already seeded

    const user1 = await this.createUser({ displayName: 'Senior CS Student', academicYear: 'senior', interests: ['Computer Science','AI','Career Advice'], isMentor: true, showInDiscover: true });
    const user2 = await this.createUser({ displayName: 'Research Assistant', academicYear: 'graduate', interests: ['Academic Writing','Research Methods','Grant Applications'], isMentor: true, showInDiscover: true });
    const user3 = await this.createUser({ displayName: 'Engineering Student', academicYear: 'junior', interests: ['Engineering','Internship Prep','Project Management'], isMentor: true, showInDiscover: true });
    const user4 = await this.createUser({ displayName: 'Pre-Med Advisor', academicYear: 'senior', interests: ['Pre-Med','MCAT Prep','Medical School Apps'], isMentor: true, showInDiscover: true });
    const user5 = await this.createUser({ displayName: 'Business Student', academicYear: 'sophomore', interests: ['Business','Entrepreneurship','Networking'], isMentor: false, showInDiscover: true });

    await this.createMentorProfile({ userId: user1.id, bio: 'Senior CS student passionate about helping freshmen navigate their first year. I\'ve been through the struggles and want to make your journey easier.', expertise: ['Computer Science','Career Advice','Research'], availability: 'Weekdays 3-6 PM', rating: 4.8, ratingCount: 12, sessionsCompleted: 42, isVerified: true });
    await this.createMentorProfile({ userId: user2.id, bio: 'Currently pursuing my graduate degree. I can help you with research opportunities, academic writing, and finding your research interests.', expertise: ['Academic Writing','Research Methods','Grant Applications'], availability: 'Tue/Thu 2-5 PM', rating: 4.9, ratingCount: 8, sessionsCompleted: 28, isVerified: true });
    await this.createMentorProfile({ userId: user3.id, bio: 'Interned at multiple top tech companies. Happy to share interview tips, resume advice, and help you land your dream internship.', expertise: ['Engineering','Internship Prep','Project Management'], availability: 'Mon/Wed 4-7 PM', rating: 4.7, ratingCount: 15, sessionsCompleted: 35, isVerified: true });
    await this.createMentorProfile({ userId: user4.id, bio: 'Pre-med student who went through the journey. Let me help you navigate coursework, volunteering, and med school applications.', expertise: ['Pre-Med','MCAT Prep','Medical School Apps'], availability: 'Weekends 10 AM - 2 PM', rating: 4.9, ratingCount: 20, sessionsCompleted: 56, isVerified: true });

    await this.createThread({ title: 'Best study techniques for finals week?', content: "I'm struggling with my study schedule and looking for tips on how to effectively prepare for multiple exams. Any advice from seniors would be greatly appreciated!", category: 'academic', authorId: user5.id, isAnonymous: true, likesCount: 47 });
    await this.createThread({ title: 'Anyone else feeling overwhelmed this semester?', content: 'First year here and it\'s been tough adjusting. Just wanted to share and see if others relate. How do you cope with stress?', category: 'mental-health', authorId: user5.id, isAnonymous: true, likesCount: 63 });
    await this.createThread({ title: 'Looking for study group partners for Calc II', content: 'Would love to find some people to study with before the midterm. Library or Zoom works for me! Drop a comment if interested.', category: 'academic', authorId: user3.id, isAnonymous: true, likesCount: 28 });
    await this.createThread({ title: 'Weekend hangout at the campus cafe?', content: "Planning a casual meetup this Saturday. Anyone interested in joining? No pressure, just good vibes and coffee.", category: 'social', authorId: user2.id, isAnonymous: true, likesCount: 52 });
    await this.createThread({ title: 'Tips for managing anxiety before presentations', content: 'I have a big presentation coming up and I\'m already nervous. What are some techniques you use to calm down?', category: 'mental-health', authorId: user1.id, isAnonymous: true, likesCount: 89 });
    await this.createThread({ title: 'Computer Science Club hosting a hackathon!', content: "We're organizing a 24-hour hackathon next month. All skill levels welcome! Sign up details inside. Prizes for the best projects!", category: 'clubs', authorId: user1.id, isAnonymous: false, likesCount: 112 });

    await this.createResource({ title: 'Calculus Study Guide - Complete Notes', description: 'Comprehensive notes covering all topics from Calculus I and II. Includes examples, practice problems, and tips.', category: 'Study Materials', fileType: 'PDF', authorId: user1.id, rating: 4.7, ratingCount: 23, downloads: 156 });
    await this.createResource({ title: 'Time Management Strategies for Students', description: 'A collection of proven techniques to manage your time effectively during the semester.', category: 'Tips', fileType: 'PDF', authorId: user2.id, rating: 4.5, ratingCount: 15, downloads: 89 });
    await this.createResource({ title: 'Mindfulness Exercises for Stress Relief', description: 'Simple exercises you can do between classes to reduce anxiety and improve focus.', category: 'Mental Health', fileType: 'PDF', authorId: user4.id, rating: 4.9, ratingCount: 42, downloads: 234 });
    await this.createResource({ title: 'Data Structures Cheat Sheet', description: 'Quick reference for common data structures with Big O notation and use cases.', category: 'Study Materials', fileType: 'PDF', authorId: user1.id, rating: 4.8, ratingCount: 56, downloads: 312 });
    await this.createResource({ title: 'Essay Writing Template', description: 'A structured template for academic essays with formatting guidelines.', category: 'Academic Support', fileType: 'DOCX', authorId: user2.id, rating: 4.4, ratingCount: 28, downloads: 178 });
    await this.createResource({ title: 'Campus Mental Health Resources Guide', description: 'Comprehensive list of on-campus and online mental health resources available to students.', category: 'Mental Health', fileType: 'PDF', authorId: user4.id, rating: 4.6, ratingCount: 33, downloads: 145 });

    const club1 = await this.createClub({ name: 'Computer Science Society', description: 'Join us for coding workshops, hackathons, and networking events with industry professionals.', category: 'Technology', membersCount: 234 });
    const club2 = await this.createClub({ name: 'Mental Health Awareness', description: 'A safe space to discuss mental health topics and support each other through college challenges.', category: 'Wellness', membersCount: 156 });

    await this.createClub({ name: 'Photography Club', description: 'Explore your creative side! Weekly photo walks, editing workshops, and gallery exhibitions.', category: 'Arts', membersCount: 89 });
    await this.createClub({ name: 'Debate Society', description: 'Sharpen your public speaking skills and engage in thought-provoking discussions.', category: 'Academic', membersCount: 112 });
    await this.createClub({ name: 'Volunteer Corps', description: 'Make a difference in the community through various volunteer opportunities.', category: 'Community Service', membersCount: 178 });
    await this.createClub({ name: 'Entrepreneurship Club', description: 'Connect with like-minded students, learn from founders, and launch your own startup.', category: 'Business', membersCount: 145 });

    await this.createEvent({ title: 'Career Fair 2024', description: 'Meet with top companies and explore internship and job opportunities.', date: '15 Dec', time: '10:00 AM - 4:00 PM', location: 'University Center', clubId: null, attendingCount: 342 });
    await this.createEvent({ title: 'Hackathon: Build for Good', description: '24-hour coding challenge to create solutions for social impact. All skill levels welcome!', date: '20 Dec', time: '6:00 PM', location: 'Engineering Building', clubId: club1.id, attendingCount: 128 });
    await this.createEvent({ title: 'Mental Health Workshop', description: 'Learn stress management techniques and self-care practices for finals season.', date: '18 Dec', time: '2:00 PM - 4:00 PM', location: 'Wellness Center', clubId: club2.id, attendingCount: 67 });
    await this.createEvent({ title: 'Winter Art Exhibition', description: 'Showcase of student artwork from the fall semester. Refreshments provided.', date: '22 Dec', time: '5:00 PM - 8:00 PM', location: 'Arts Gallery', clubId: null, attendingCount: 89 });
  }

  // Users
  async getUser(id: string) {
    return this.users.find(u => u.id === id);
  }

  async createUser(user: InsertUser) {
    const newUser = { ...user, id: (user as any).id || this.makeId('u_') } as User;
    this.users.push(newUser);
    return newUser;
  }

  async updateUser(id: string, data: Partial<InsertUser>) {
    const user = this.users.find(u => u.id === id);
    if (!user) return undefined;
    Object.assign(user, data);
    return user;
  }

  async getDiscoverableUsers(excludeUserId?: string) {
    return this.users.filter(u => u.showInDiscover && u.id !== excludeUserId);
  }

  // Threads
  async getThreads(category?: string, search?: string) {
    let res = [...this.threads];
    if (category && category !== 'all') res = res.filter(t => t.category === category);
    if (search) {
      const q = search.toLowerCase();
      res = res.filter(t => (t.title || '').toLowerCase().includes(q) || (t.content || '').toLowerCase().includes(q));
    }
    return res.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getThread(id: string) {
    return this.threads.find(t => t.id === id);
  }

  async createThread(thread: InsertThread) {
    const newThread = { ...thread, id: (thread as any).id || this.makeId('t_'), createdAt: new Date() } as unknown as Thread;
    this.threads.push(newThread);
    return newThread;
  }

  async likeThread(threadId: string, userId: string) {
    this.threadLikesSet.add(`${threadId}:${userId}`);
    const t = this.threads.find(x => x.id === threadId);
    if (t) t.likesCount = (t.likesCount || 0) + 1;
  }

  async unlikeThread(threadId: string, userId: string) {
    this.threadLikesSet.delete(`${threadId}:${userId}`);
    const t = this.threads.find(x => x.id === threadId);
    if (t) t.likesCount = Math.max(0, (t.likesCount || 0) - 1);
  }

  async hasUserLikedThread(threadId: string, userId: string) {
    return this.threadLikesSet.has(`${threadId}:${userId}`);
  }

  // Replies
  async getReplies(threadId: string) {
    return this.replies.filter(r => r.threadId === threadId).sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  async createReply(reply: InsertReply) {
    const newReply = { ...reply, id: (reply as any).id || this.makeId('r_'), createdAt: new Date() } as unknown as Reply;
    this.replies.push(newReply);
    return newReply;
  }

  // Resources
  async getResources(category?: string, search?: string) {
    let res = [...this.resources];
    if (category && category !== 'all') res = res.filter(r => r.category === category);
    if (search) {
      const q = search.toLowerCase();
      res = res.filter(r => (r.title || '').toLowerCase().includes(q) || (r.description || '').toLowerCase().includes(q));
    }
    return res.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getResource(id: string) { return this.resources.find(r => r.id === id); }

  async createResource(resource: InsertResource) {
    const newResource = { ...resource, id: (resource as any).id || this.makeId('res_'), createdAt: new Date(), downloads: 0, rating: 0, ratingCount: 0 } as unknown as Resource;
    this.resources.push(newResource);
    return newResource;
  }

  async rateResource(resourceId: string, userId: string, rating: number) {
    // naive: store a simple ratings array on resource
    const r = this.resources.find(x => x.id === resourceId);
    if (!r) return;
    (r as any)._ratings = (r as any)._ratings || [];
    const existing = (r as any)._ratings.find((rr: any) => rr.userId === userId);
    if (existing) existing.rating = rating; else (r as any)._ratings.push({ userId, rating });
    r.ratingCount = (r as any)._ratings.length;
    r.rating = ((r as any)._ratings.reduce((s: number, it: any) => s + it.rating, 0)) / r.ratingCount;
  }

  async incrementDownloads(resourceId: string) {
    const r = this.resources.find(x => x.id === resourceId);
    if (r) r.downloads = (r.downloads || 0) + 1;
  }

  // Mentors
  async getMentorProfiles() {
    return this.mentorProfiles.map(p => ({ ...p, user: this.users.find(u => u.id === p.userId)! }));
  }

  async getMentorProfile(id: string) { return this.mentorProfiles.find(p => p.id === id); }

  async createMentorProfile(profile: InsertMentorProfile) {
    const newProfile = { ...profile, id: (profile as any).id || this.makeId('mp_') } as unknown as MentorProfile;
    this.mentorProfiles.push(newProfile);
    const user = this.users.find(u => u.id === profile.userId);
    if (user) user.isMentor = true;
    return newProfile;
  }

  async requestMentorship(request: InsertMentorshipRequest) {
    const newReq = { ...request, id: (request as any).id || this.makeId('mr_'), createdAt: new Date(), status: 'pending' } as unknown as MentorshipRequest;
    this.mentorshipRequests.push(newReq);
    return newReq;
  }

  async getMentorshipRequests(mentorProfileId: string) { return this.mentorshipRequests.filter(r => r.mentorProfileId === mentorProfileId); }

  async updateMentorshipRequest(id: string, status: string) {
    const r = this.mentorshipRequests.find(x => x.id === id);
    if (!r) return undefined;
    r.status = status as any;
    r.updatedAt = new Date();
    return r;
  }

  // Clubs
  async getClubs(search?: string) {
    let res = [...this.clubs];
    if (search) {
      const q = search.toLowerCase();
      res = res.filter(c => (c.name || '').toLowerCase().includes(q) || (c.description || '').toLowerCase().includes(q));
    }
    return res.sort((a,b) => (b.membersCount || 0) - (a.membersCount || 0));
  }

  async getClub(id: string) { return this.clubs.find(c => c.id === id); }

  async createClub(club: InsertClub) { const newClub = { ...club, id: (club as any).id || this.makeId('c_') } as unknown as Club; this.clubs.push(newClub); return newClub; }

  async joinClub(clubId: string, userId: string) { const c = this.clubs.find(x => x.id === clubId); if (c) c.membersCount = (c.membersCount || 0) + 1; }

  async leaveClub(clubId: string, userId: string) { const c = this.clubs.find(x => x.id === clubId); if (c) c.membersCount = Math.max(0, (c.membersCount || 0) - 1); }

  async isUserInClub(clubId: string, userId: string) { return false; }

  // Events
  async getEvents(search?: string) {
    let res = [...this.events];
    if (search) { const q = search.toLowerCase(); res = res.filter(e => (e.title||'').toLowerCase().includes(q) || (e.description||'').toLowerCase().includes(q)); }
    return res.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getEvent(id: string) { return this.events.find(e => e.id === id); }

  async createEvent(event: InsertEvent) { const newE = { ...event, id: (event as any).id || this.makeId('ev_'), createdAt: new Date() } as unknown as Event; this.events.push(newE); return newE; }

  async registerForEvent(eventId: string, userId: string) { const e = this.events.find(x => x.id === eventId); if (e) e.attendingCount = (e.attendingCount || 0) + 1; }

  async unregisterFromEvent(eventId: string, userId: string) { const e = this.events.find(x => x.id === eventId); if (e) e.attendingCount = Math.max(0, (e.attendingCount || 0) - 1); }

  async isUserRegisteredForEvent(eventId: string, userId: string) { return false; }

  // Connections
  async createConnection(connection: InsertConnection) { const newC = { ...connection, id: (connection as any).id || this.makeId('con_') } as unknown as Connection; this.connections.push(newC); return newC; }

  async getConnections(userId: string) { return this.connections.filter(c => c.requesterId === userId || c.targetId === userId); }

  async updateConnectionStatus(id: string, status: string) { const c = this.connections.find(x => x.id === id); if (!c) return undefined; c.status = status as any; return c; }

  // Todos
  async getTodos(userId: string) { return this.todos.filter(t => t.userId === userId).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); }

  async createTodo(todo: InsertTodo) { const newT = { ...todo, id: (todo as any).id || this.makeId('todo_'), createdAt: new Date(), completed: false } as unknown as Todo; this.todos.push(newT); return newT; }

  async updateTodo(id: string, completed: boolean) { const t = this.todos.find(x => x.id === id); if (!t) return undefined; t.completed = completed; return t; }

  async deleteTodo(id: string) { this.todos = this.todos.filter(t => t.id !== id); }

  // Stats
  async getStats() { return { activeUsers: this.users.length, forumThreads: this.threads.length, activeMentors: this.mentorProfiles.length }; }
}

export const storage: IStorage = (typeof db === 'undefined' || db === undefined) ? new MockStorage() : new DatabaseStorage();
