# The Student Hub

## Overview
A full-stack anonymous social platform for college students built with React, Express, and PostgreSQL. The platform prioritizes user anonymity, safe community building, mentorship matching, discussion forums, and academic resource sharing.

## Recent Changes
- **Dec 2, 2025**: Initial UI implementation with complete frontend design
  - Created dashboard with hero section, quick navigation, and stats
  - Built discussion forums with category filtering and search
  - Implemented resources page for study materials
  - Added clubs and events discovery
  - Created mentorship matching interface
  - Built student discovery page with interest-based filtering
  - Implemented settings page with theme, notification, and privacy controls

## Project Architecture

### Frontend (client/src/)
- **Pages**: Dashboard, Forums, Resources, Clubs, Mentorship, Discover, Settings
- **Components**: 30+ reusable components including:
  - Navigation: AppSidebar, MobileNav
  - Cards: ThreadCard, MentorCard, ResourceCard, ClubCard, EventCard, ProfileCard
  - Widgets: TodoWidget, TrendingTopics, UpcomingEvents, SuggestedMentors
  - Dialogs: CreateThreadDialog, UploadResourceDialog
  - Common: ThemeToggle, NotificationBell, SearchBar, CategoryBadge

### Design System
- **Primary Color**: Teal (#208090)
- **Secondary Color**: Purple (#6366F1)
- **Typography**: Inter font family
- **Theme**: Light/Dark mode support with system preference detection

### Tech Stack
- React 18 with TypeScript
- Wouter for routing
- TanStack Query for data fetching
- Shadcn/ui components with Tailwind CSS
- Express.js backend
- PostgreSQL with Drizzle ORM

## User Preferences
- Anonymous-first design with privacy controls
- No food delivery or revenue features
- Focus on student safety and community building

## Current State
- Frontend: Complete UI prototype with mock data
- Backend: Schema and routes stubbed, ready for implementation
- Database: PostgreSQL connected, migrations pending

## Next Steps
1. Implement backend API endpoints
2. Create database migrations
3. Connect frontend to real data
4. Add user authentication
5. Implement real-time features with WebSockets
