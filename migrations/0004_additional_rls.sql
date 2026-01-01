-- 0004_additional_rls.sql
-- Additional Row Level Security (RLS) policies for interactive tables
-- This file adds RLS for:
--   - thread_likes
--   - resource_ratings
--   - club_members
--   - event_attendees
--   - connections
--   - users (safe defaults)
--
-- NOTE: Several policies rely on `auth.uid()` matching a user identifier column
-- (e.g., `user_id`, `author_id`). Ensure your auth-to-user mapping is implemented
-- (for example, store Supabase auth UID in `users.auth_uid` or set `users.id` to
-- the auth UID at creation). If you do not have such mapping, prefer server-side
-- operations for mutations until mapping is added.

-- THREAD_LIKES
ALTER TABLE public.thread_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY thread_likes_public_select ON public.thread_likes FOR SELECT USING (true);
CREATE POLICY thread_likes_insert_owner ON public.thread_likes FOR INSERT WITH CHECK (
  auth.role() = 'authenticated' AND auth.uid() = user_id
);
CREATE POLICY thread_likes_delete_owner ON public.thread_likes FOR DELETE USING (
  auth.role() = 'authenticated' AND auth.uid() = user_id
);

-- RESOURCE_RATINGS
ALTER TABLE public.resource_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY resource_ratings_public_select ON public.resource_ratings FOR SELECT USING (true);
CREATE POLICY resource_ratings_insert_owner ON public.resource_ratings FOR INSERT WITH CHECK (
  auth.role() = 'authenticated' AND auth.uid() = user_id
);
CREATE POLICY resource_ratings_update_owner ON public.resource_ratings FOR UPDATE USING (
  auth.role() = 'authenticated' AND auth.uid() = user_id
) WITH CHECK (
  auth.role() = 'authenticated' AND auth.uid() = user_id
);
CREATE POLICY resource_ratings_delete_owner ON public.resource_ratings FOR DELETE USING (
  auth.role() = 'authenticated' AND auth.uid() = user_id
);

-- CLUB_MEMBERS
ALTER TABLE public.club_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY club_members_public_select ON public.club_members FOR SELECT USING (true);
CREATE POLICY club_members_insert_owner ON public.club_members FOR INSERT WITH CHECK (
  auth.role() = 'authenticated' AND auth.uid() = user_id
);
CREATE POLICY club_members_delete_owner ON public.club_members FOR DELETE USING (
  auth.role() = 'authenticated' AND auth.uid() = user_id
);

-- EVENT_ATTENDEES
ALTER TABLE public.event_attendees ENABLE ROW LEVEL SECURITY;

CREATE POLICY event_attendees_public_select ON public.event_attendees FOR SELECT USING (true);
CREATE POLICY event_attendees_insert_owner ON public.event_attendees FOR INSERT WITH CHECK (
  auth.role() = 'authenticated' AND auth.uid() = user_id
);
CREATE POLICY event_attendees_delete_owner ON public.event_attendees FOR DELETE USING (
  auth.role() = 'authenticated' AND auth.uid() = user_id
);

-- CONNECTIONS
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY connections_public_select ON public.connections FOR SELECT USING (true);
CREATE POLICY connections_insert_requester ON public.connections FOR INSERT WITH CHECK (
  auth.role() = 'authenticated' AND auth.uid() = requester_id AND requester_id <> target_id
);
CREATE POLICY connections_delete_owner ON public.connections FOR DELETE USING (
  auth.role() = 'authenticated' AND (auth.uid() = requester_id OR auth.uid() = target_id)
);

-- USERS (safe default)
-- Allow public select (use careful column-level exposure in API if needed)
-- Allow inserts by authenticated users (you should manage mapping from auth.uid to users.id)
-- Do NOT allow updates/deletes from the client by default (server-only changes recommended)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY users_public_select ON public.users FOR SELECT USING (true);
CREATE POLICY users_insert_auth ON public.users FOR INSERT WITH CHECK (
  auth.role() = 'authenticated'
);
-- No client-side UPDATE/DELETE policies are added; those operations should be performed
-- by the server using a service role key or after adding an `auth_uid` mapping column.

-- Optional: add constraints/guard rails (uncomment if you map auth.uid() to users.id):
-- CREATE POLICY users_update_owner ON public.users FOR UPDATE USING (auth.role() = 'authenticated' AND auth.uid() = id) WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = id);
-- CREATE POLICY users_delete_owner ON public.users FOR DELETE USING (auth.role() = 'authenticated' AND auth.uid() = id);

-- End of additional RLS migration
