-- 0002_create_full_schema.sql
-- Full DB schema for StudentHubConnect (Postgres / Supabase)
-- Includes extensions, tables (IF NOT EXISTS), indexes and uniqueness constraints.

-- Extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Users
CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  display_name text NOT NULL,
  academic_year text,
  interests text[] NOT NULL DEFAULT ARRAY[]::text[],
  is_mentor boolean NOT NULL DEFAULT false,
  show_in_discover boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Threads
CREATE TABLE IF NOT EXISTS public.threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  category text,
  author_id uuid REFERENCES public.users(id) ON DELETE SET NULL,
  is_anonymous boolean NOT NULL DEFAULT false,
  likes_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Replies
CREATE TABLE IF NOT EXISTS public.replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid REFERENCES public.threads(id) ON DELETE CASCADE,
  content text NOT NULL,
  author_id uuid REFERENCES public.users(id) ON DELETE SET NULL,
  is_anonymous boolean NOT NULL DEFAULT false,
  likes_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Thread likes
CREATE TABLE IF NOT EXISTS public.thread_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid REFERENCES public.threads(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT thread_likes_unique UNIQUE (thread_id, user_id)
);

-- Resources
CREATE TABLE IF NOT EXISTS public.resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text,
  file_type text,
  file_url text,
  external_url text,
  author_id uuid REFERENCES public.users(id) ON DELETE SET NULL,
  rating numeric NOT NULL DEFAULT 0,
  rating_count integer NOT NULL DEFAULT 0,
  downloads integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Resource ratings
CREATE TABLE IF NOT EXISTS public.resource_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id uuid REFERENCES public.resources(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  rating integer CHECK (rating BETWEEN 1 AND 5),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT resource_ratings_unique UNIQUE (resource_id, user_id)
);

-- Mentor profiles
CREATE TABLE IF NOT EXISTS public.mentor_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  bio text,
  expertise text[] NOT NULL DEFAULT ARRAY[]::text[],
  availability text,
  rating numeric NOT NULL DEFAULT 0,
  rating_count integer NOT NULL DEFAULT 0,
  sessions_completed integer NOT NULL DEFAULT 0,
  is_verified boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Mentorship requests
CREATE TABLE IF NOT EXISTS public.mentorship_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_profile_id uuid REFERENCES public.mentor_profiles(id) ON DELETE CASCADE,
  student_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  message text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Clubs
CREATE TABLE IF NOT EXISTS public.clubs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category text,
  members_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Club members
CREATE TABLE IF NOT EXISTS public.club_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id uuid REFERENCES public.clubs(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  joined_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT club_members_unique UNIQUE (club_id, user_id)
);

-- Events
CREATE TABLE IF NOT EXISTS public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  date date NOT NULL,
  time time NOT NULL,
  location text,
  club_id uuid REFERENCES public.clubs(id) ON DELETE SET NULL,
  attending_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Event attendees
CREATE TABLE IF NOT EXISTS public.event_attendees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES public.events(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  registered_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT event_attendees_unique UNIQUE (event_id, user_id)
);

-- Connections
CREATE TABLE IF NOT EXISTS public.connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  target_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT connections_unique UNIQUE (requester_id, target_id)
);

-- Todos
CREATE TABLE IF NOT EXISTS public.todos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  text text NOT NULL,
  completed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Announcements (idempotent - many environments may already have this)
CREATE TABLE IF NOT EXISTS public.announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes (foreign key indexes)
CREATE INDEX IF NOT EXISTS idx_threads_author_id ON public.threads (author_id);
CREATE INDEX IF NOT EXISTS idx_replies_thread_id ON public.replies (thread_id);
CREATE INDEX IF NOT EXISTS idx_replies_author_id ON public.replies (author_id);
CREATE INDEX IF NOT EXISTS idx_thread_likes_thread_id ON public.thread_likes (thread_id);
CREATE INDEX IF NOT EXISTS idx_thread_likes_user_id ON public.thread_likes (user_id);
CREATE INDEX IF NOT EXISTS idx_resources_author_id ON public.resources (author_id);
CREATE INDEX IF NOT EXISTS idx_resource_ratings_resource_id ON public.resource_ratings (resource_id);
CREATE INDEX IF NOT EXISTS idx_resource_ratings_user_id ON public.resource_ratings (user_id);
CREATE INDEX IF NOT EXISTS idx_mentor_profiles_user_id ON public.mentor_profiles (user_id);
CREATE INDEX IF NOT EXISTS idx_mentorship_requests_mentor_profile_id ON public.mentorship_requests (mentor_profile_id);
CREATE INDEX IF NOT EXISTS idx_mentorship_requests_student_id ON public.mentorship_requests (student_id);
CREATE INDEX IF NOT EXISTS idx_club_members_club_id ON public.club_members (club_id);
CREATE INDEX IF NOT EXISTS idx_club_members_user_id ON public.club_members (user_id);
CREATE INDEX IF NOT EXISTS idx_events_club_id ON public.events (club_id);
CREATE INDEX IF NOT EXISTS idx_event_attendees_event_id ON public.event_attendees (event_id);
CREATE INDEX IF NOT EXISTS idx_event_attendees_user_id ON public.event_attendees (user_id);
CREATE INDEX IF NOT EXISTS idx_connections_requester_id ON public.connections (requester_id);
CREATE INDEX IF NOT EXISTS idx_connections_target_id ON public.connections (target_id);
CREATE INDEX IF NOT EXISTS idx_todos_user_id ON public.todos (user_id);

-- Trigram GIN indexes for fast search
CREATE INDEX IF NOT EXISTS threads_title_trgm_idx ON public.threads USING GIN (title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS threads_content_trgm_idx ON public.threads USING GIN (content gin_trgm_ops);

-- Additional useful indexes
CREATE INDEX IF NOT EXISTS idx_threads_created_at ON public.threads (created_at);
CREATE INDEX IF NOT EXISTS idx_replies_created_at ON public.replies (created_at);
CREATE INDEX IF NOT EXISTS idx_resources_created_at ON public.resources (created_at);
CREATE INDEX IF NOT EXISTS idx_announcements_created_at ON public.announcements (created_at);

-- End of migration
