import { db } from "./db";
import { users, threads, resources, mentorProfiles, clubs, events } from "@shared/schema";
import { sql } from "drizzle-orm";

async function seed() {
  console.log("Seeding database...");

  // Create sample users
  const [user1] = await db.insert(users).values({
    displayName: "Senior CS Student",
    academicYear: "senior",
    interests: ["Computer Science", "AI", "Career Advice"],
    isMentor: true,
    showInDiscover: true,
  }).returning();

  const [user2] = await db.insert(users).values({
    displayName: "Research Assistant",
    academicYear: "graduate",
    interests: ["Academic Writing", "Research Methods", "Grant Applications"],
    isMentor: true,
    showInDiscover: true,
  }).returning();

  const [user3] = await db.insert(users).values({
    displayName: "Engineering Student",
    academicYear: "junior",
    interests: ["Engineering", "Internship Prep", "Project Management"],
    isMentor: true,
    showInDiscover: true,
  }).returning();

  const [user4] = await db.insert(users).values({
    displayName: "Pre-Med Advisor",
    academicYear: "senior",
    interests: ["Pre-Med", "MCAT Prep", "Medical School Apps"],
    isMentor: true,
    showInDiscover: true,
  }).returning();

  const [user5] = await db.insert(users).values({
    displayName: "Business Student",
    academicYear: "sophomore",
    interests: ["Business", "Entrepreneurship", "Networking"],
    isMentor: false,
    showInDiscover: true,
  }).returning();

  // Create mentor profiles
  await db.insert(mentorProfiles).values([
    {
      userId: user1.id,
      bio: "Senior CS student passionate about helping freshmen navigate their first year. I've been through the struggles and want to make your journey easier.",
      expertise: ["Computer Science", "Career Advice", "Research"],
      availability: "Weekdays 3-6 PM",
      rating: 4.8,
      ratingCount: 12,
      sessionsCompleted: 42,
      isVerified: true,
    },
    {
      userId: user2.id,
      bio: "Currently pursuing my graduate degree. I can help you with research opportunities, academic writing, and finding your research interests.",
      expertise: ["Academic Writing", "Research Methods", "Grant Applications"],
      availability: "Tue/Thu 2-5 PM",
      rating: 4.9,
      ratingCount: 8,
      sessionsCompleted: 28,
      isVerified: true,
    },
    {
      userId: user3.id,
      bio: "Interned at multiple top tech companies. Happy to share interview tips, resume advice, and help you land your dream internship.",
      expertise: ["Engineering", "Internship Prep", "Project Management"],
      availability: "Mon/Wed 4-7 PM",
      rating: 4.7,
      ratingCount: 15,
      sessionsCompleted: 35,
      isVerified: true,
    },
    {
      userId: user4.id,
      bio: "Pre-med student who went through the journey. Let me help you navigate coursework, volunteering, and med school applications.",
      expertise: ["Pre-Med", "MCAT Prep", "Medical School Apps"],
      availability: "Weekends 10 AM - 2 PM",
      rating: 4.9,
      ratingCount: 20,
      sessionsCompleted: 56,
      isVerified: true,
    },
  ]);

  // Create sample threads
  await db.insert(threads).values([
    {
      title: "Best study techniques for finals week?",
      content: "I'm struggling with my study schedule and looking for tips on how to effectively prepare for multiple exams. Any advice from seniors would be greatly appreciated!",
      category: "academic",
      authorId: user5.id,
      isAnonymous: true,
      likesCount: 47,
    },
    {
      title: "Anyone else feeling overwhelmed this semester?",
      content: "First year here and it's been tough adjusting. Just wanted to share and see if others relate. How do you cope with stress?",
      category: "mental-health",
      authorId: user5.id,
      isAnonymous: true,
      likesCount: 63,
    },
    {
      title: "Looking for study group partners for Calc II",
      content: "Would love to find some people to study with before the midterm. Library or Zoom works for me! Drop a comment if interested.",
      category: "academic",
      authorId: user3.id,
      isAnonymous: true,
      likesCount: 28,
    },
    {
      title: "Weekend hangout at the campus cafe?",
      content: "Planning a casual meetup this Saturday. Anyone interested in joining? No pressure, just good vibes and coffee.",
      category: "social",
      authorId: user2.id,
      isAnonymous: true,
      likesCount: 52,
    },
    {
      title: "Tips for managing anxiety before presentations",
      content: "I have a big presentation coming up and I'm already nervous. What are some techniques you use to calm down?",
      category: "mental-health",
      authorId: user1.id,
      isAnonymous: true,
      likesCount: 89,
    },
    {
      title: "Computer Science Club hosting a hackathon!",
      content: "We're organizing a 24-hour hackathon next month. All skill levels welcome! Sign up details inside. Prizes for the best projects!",
      category: "clubs",
      authorId: user1.id,
      isAnonymous: false,
      likesCount: 112,
    },
  ]);

  // Create sample resources
  await db.insert(resources).values([
    {
      title: "Calculus Study Guide - Complete Notes",
      description: "Comprehensive notes covering all topics from Calculus I and II. Includes examples, practice problems, and tips.",
      category: "Study Materials",
      fileType: "PDF",
      authorId: user1.id,
      rating: 4.7,
      ratingCount: 23,
      downloads: 156,
    },
    {
      title: "Time Management Strategies for Students",
      description: "A collection of proven techniques to manage your time effectively during the semester.",
      category: "Tips",
      fileType: "PDF",
      authorId: user2.id,
      rating: 4.5,
      ratingCount: 15,
      downloads: 89,
    },
    {
      title: "Mindfulness Exercises for Stress Relief",
      description: "Simple exercises you can do between classes to reduce anxiety and improve focus.",
      category: "Mental Health",
      fileType: "PDF",
      authorId: user4.id,
      rating: 4.9,
      ratingCount: 42,
      downloads: 234,
    },
    {
      title: "Data Structures Cheat Sheet",
      description: "Quick reference for common data structures with Big O notation and use cases.",
      category: "Study Materials",
      fileType: "PDF",
      authorId: user1.id,
      rating: 4.8,
      ratingCount: 56,
      downloads: 312,
    },
    {
      title: "Essay Writing Template",
      description: "A structured template for academic essays with formatting guidelines.",
      category: "Academic Support",
      fileType: "DOCX",
      authorId: user2.id,
      rating: 4.4,
      ratingCount: 28,
      downloads: 178,
    },
    {
      title: "Campus Mental Health Resources Guide",
      description: "Comprehensive list of on-campus and online mental health resources available to students.",
      category: "Mental Health",
      fileType: "PDF",
      authorId: user4.id,
      rating: 4.6,
      ratingCount: 33,
      downloads: 145,
    },
  ]);

  // Create sample clubs
  const [club1] = await db.insert(clubs).values({
    name: "Computer Science Society",
    description: "Join us for coding workshops, hackathons, and networking events with industry professionals.",
    category: "Technology",
    membersCount: 234,
  }).returning();

  const [club2] = await db.insert(clubs).values({
    name: "Mental Health Awareness",
    description: "A safe space to discuss mental health topics and support each other through college challenges.",
    category: "Wellness",
    membersCount: 156,
  }).returning();

  await db.insert(clubs).values([
    {
      name: "Photography Club",
      description: "Explore your creative side! Weekly photo walks, editing workshops, and gallery exhibitions.",
      category: "Arts",
      membersCount: 89,
    },
    {
      name: "Debate Society",
      description: "Sharpen your public speaking skills and engage in thought-provoking discussions.",
      category: "Academic",
      membersCount: 112,
    },
    {
      name: "Volunteer Corps",
      description: "Make a difference in the community through various volunteer opportunities.",
      category: "Community Service",
      membersCount: 178,
    },
    {
      name: "Entrepreneurship Club",
      description: "Connect with like-minded students, learn from founders, and launch your own startup.",
      category: "Business",
      membersCount: 145,
    },
  ]);

  // Create sample events
  await db.insert(events).values([
    {
      title: "Career Fair 2024",
      description: "Meet with top companies and explore internship and job opportunities.",
      date: "15 Dec",
      time: "10:00 AM - 4:00 PM",
      location: "University Center",
      clubId: null,
      attendingCount: 342,
    },
    {
      title: "Hackathon: Build for Good",
      description: "24-hour coding challenge to create solutions for social impact. All skill levels welcome!",
      date: "20 Dec",
      time: "6:00 PM",
      location: "Engineering Building",
      clubId: club1.id,
      attendingCount: 128,
    },
    {
      title: "Mental Health Workshop",
      description: "Learn stress management techniques and self-care practices for finals season.",
      date: "18 Dec",
      time: "2:00 PM - 4:00 PM",
      location: "Wellness Center",
      clubId: club2.id,
      attendingCount: 67,
    },
    {
      title: "Winter Art Exhibition",
      description: "Showcase of student artwork from the fall semester. Refreshments provided.",
      date: "22 Dec",
      time: "5:00 PM - 8:00 PM",
      location: "Arts Gallery",
      clubId: null,
      attendingCount: 89,
    },
  ]);

  console.log("Database seeded successfully!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Error seeding database:", err);
  process.exit(1);
});
