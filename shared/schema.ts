import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users - Anonymous student profiles
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  displayName: text("display_name").notNull().default("Anonymous Student"),
  academicYear: text("academic_year").notNull().default("freshman"),
  interests: text("interests").array().notNull().default(sql`ARRAY[]::text[]`),
  isMentor: boolean("is_mentor").notNull().default(false),
  showOnline: boolean("show_online").notNull().default(false),
  allowMessages: boolean("allow_messages").notNull().default(true),
  showInDiscover: boolean("show_in_discover").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  threads: many(threads),
  replies: many(replies),
  resources: many(resources),
  mentorProfile: many(mentorProfiles),
  connections: many(connections),
}));

// Threads - Forum discussion posts
export const threads = pgTable("threads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(), // academic, social, mental-health, clubs
  authorId: varchar("author_id").notNull().references(() => users.id),
  isAnonymous: boolean("is_anonymous").notNull().default(true),
  likesCount: integer("likes_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const threadsRelations = relations(threads, ({ one, many }) => ({
  author: one(users, { fields: [threads.authorId], references: [users.id] }),
  replies: many(replies),
  likes: many(threadLikes),
}));

// Replies - Thread comments
export const replies = pgTable("replies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  threadId: varchar("thread_id").notNull().references(() => threads.id),
  content: text("content").notNull(),
  authorId: varchar("author_id").notNull().references(() => users.id),
  isAnonymous: boolean("is_anonymous").notNull().default(true),
  likesCount: integer("likes_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const repliesRelations = relations(replies, ({ one }) => ({
  thread: one(threads, { fields: [replies.threadId], references: [threads.id] }),
  author: one(users, { fields: [replies.authorId], references: [users.id] }),
}));

// Thread Likes
export const threadLikes = pgTable("thread_likes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  threadId: varchar("thread_id").notNull().references(() => threads.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const threadLikesRelations = relations(threadLikes, ({ one }) => ({
  thread: one(threads, { fields: [threadLikes.threadId], references: [threads.id] }),
  user: one(users, { fields: [threadLikes.userId], references: [users.id] }),
}));

// Resources - Study materials and helpful content
export const resources = pgTable("resources", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // study-materials, tips, mental-health, academic-support
  fileType: text("file_type").notNull(),
  fileUrl: text("file_url"),
  externalUrl: text("external_url"),
  authorId: varchar("author_id").notNull().references(() => users.id),
  rating: real("rating").notNull().default(0),
  ratingCount: integer("rating_count").notNull().default(0),
  downloads: integer("downloads").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const resourcesRelations = relations(resources, ({ one, many }) => ({
  author: one(users, { fields: [resources.authorId], references: [users.id] }),
  ratings: many(resourceRatings),
}));

// Resource Ratings
export const resourceRatings = pgTable("resource_ratings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  resourceId: varchar("resource_id").notNull().references(() => resources.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  rating: integer("rating").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const resourceRatingsRelations = relations(resourceRatings, ({ one }) => ({
  resource: one(resources, { fields: [resourceRatings.resourceId], references: [resources.id] }),
  user: one(users, { fields: [resourceRatings.userId], references: [users.id] }),
}));

// Mentor Profiles - Extended info for mentors
export const mentorProfiles = pgTable("mentor_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id).unique(),
  bio: text("bio").notNull(),
  expertise: text("expertise").array().notNull().default(sql`ARRAY[]::text[]`),
  availability: text("availability").notNull(),
  rating: real("rating").notNull().default(0),
  ratingCount: integer("rating_count").notNull().default(0),
  sessionsCompleted: integer("sessions_completed").notNull().default(0),
  isVerified: boolean("is_verified").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const mentorProfilesRelations = relations(mentorProfiles, ({ one, many }) => ({
  user: one(users, { fields: [mentorProfiles.userId], references: [users.id] }),
  requests: many(mentorshipRequests),
}));

// Mentorship Requests
export const mentorshipRequests = pgTable("mentorship_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  mentorProfileId: varchar("mentor_profile_id").notNull().references(() => mentorProfiles.id),
  studentId: varchar("student_id").notNull().references(() => users.id),
  message: text("message"),
  status: text("status").notNull().default("pending"), // pending, accepted, declined
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const mentorshipRequestsRelations = relations(mentorshipRequests, ({ one }) => ({
  mentorProfile: one(mentorProfiles, { fields: [mentorshipRequests.mentorProfileId], references: [mentorProfiles.id] }),
  student: one(users, { fields: [mentorshipRequests.studentId], references: [users.id] }),
}));

// Clubs
export const clubs = pgTable("clubs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  membersCount: integer("members_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const clubsRelations = relations(clubs, ({ many }) => ({
  members: many(clubMembers),
  events: many(events),
}));

// Club Members
export const clubMembers = pgTable("club_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clubId: varchar("club_id").notNull().references(() => clubs.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  joinedAt: timestamp("joined_at").notNull().defaultNow(),
});

export const clubMembersRelations = relations(clubMembers, ({ one }) => ({
  club: one(clubs, { fields: [clubMembers.clubId], references: [clubs.id] }),
  user: one(users, { fields: [clubMembers.userId], references: [users.id] }),
}));

// Events
export const events = pgTable("events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  date: text("date").notNull(),
  time: text("time").notNull(),
  location: text("location").notNull(),
  clubId: varchar("club_id").references(() => clubs.id),
  attendingCount: integer("attending_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const eventsRelations = relations(events, ({ one, many }) => ({
  club: one(clubs, { fields: [events.clubId], references: [clubs.id] }),
  attendees: many(eventAttendees),
}));

// Event Attendees
export const eventAttendees = pgTable("event_attendees", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  eventId: varchar("event_id").notNull().references(() => events.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  registeredAt: timestamp("registered_at").notNull().defaultNow(),
});

export const eventAttendeesRelations = relations(eventAttendees, ({ one }) => ({
  event: one(events, { fields: [eventAttendees.eventId], references: [events.id] }),
  user: one(users, { fields: [eventAttendees.userId], references: [users.id] }),
}));

// Connections - Student-to-student connections
export const connections = pgTable("connections", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  requesterId: varchar("requester_id").notNull().references(() => users.id),
  targetId: varchar("target_id").notNull().references(() => users.id),
  status: text("status").notNull().default("pending"), // pending, accepted, declined
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const connectionsRelations = relations(connections, ({ one }) => ({
  requester: one(users, { fields: [connections.requesterId], references: [users.id] }),
  target: one(users, { fields: [connections.targetId], references: [users.id] }),
}));

// Todos - Personal task list
export const todos = pgTable("todos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  text: text("text").notNull(),
  completed: boolean("completed").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const todosRelations = relations(todos, ({ one }) => ({
  user: one(users, { fields: [todos.userId], references: [users.id] }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertThreadSchema = createInsertSchema(threads).omit({ id: true, createdAt: true, updatedAt: true, likesCount: true });
export const insertReplySchema = createInsertSchema(replies).omit({ id: true, createdAt: true, likesCount: true });
export const insertResourceSchema = createInsertSchema(resources).omit({ id: true, createdAt: true, rating: true, ratingCount: true, downloads: true });
export const insertMentorProfileSchema = createInsertSchema(mentorProfiles).omit({ id: true, createdAt: true, rating: true, ratingCount: true, sessionsCompleted: true, isVerified: true });
export const insertMentorshipRequestSchema = createInsertSchema(mentorshipRequests).omit({ id: true, createdAt: true, updatedAt: true, status: true });
export const insertClubSchema = createInsertSchema(clubs).omit({ id: true, createdAt: true, membersCount: true });
export const insertEventSchema = createInsertSchema(events).omit({ id: true, createdAt: true, attendingCount: true });
export const insertConnectionSchema = createInsertSchema(connections).omit({ id: true, createdAt: true, status: true });
export const insertTodoSchema = createInsertSchema(todos).omit({ id: true, createdAt: true, completed: true });

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertThread = z.infer<typeof insertThreadSchema>;
export type Thread = typeof threads.$inferSelect;
export type InsertReply = z.infer<typeof insertReplySchema>;
export type Reply = typeof replies.$inferSelect;
export type InsertResource = z.infer<typeof insertResourceSchema>;
export type Resource = typeof resources.$inferSelect;
export type InsertMentorProfile = z.infer<typeof insertMentorProfileSchema>;
export type MentorProfile = typeof mentorProfiles.$inferSelect;
export type InsertMentorshipRequest = z.infer<typeof insertMentorshipRequestSchema>;
export type MentorshipRequest = typeof mentorshipRequests.$inferSelect;
export type InsertClub = z.infer<typeof insertClubSchema>;
export type Club = typeof clubs.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;
export type InsertConnection = z.infer<typeof insertConnectionSchema>;
export type Connection = typeof connections.$inferSelect;
export type InsertTodo = z.infer<typeof insertTodoSchema>;
export type Todo = typeof todos.$inferSelect;
