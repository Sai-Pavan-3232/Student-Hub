-- 0003_rls_policies.sql
-- Row Level Security (RLS) for selected tables
-- Rules:
--  - Public SELECT is allowed
--  - INSERT/UPDATE/DELETE only for authenticated users; for rows that have an owner column
--    we require auth.uid() to match that owner (author_id or user_id). For tables without
--    owner columns (clubs, events) we require only that the caller is authenticated.

-- THREADS
ALTER TABLE public.threads ENABLE ROW LEVEL SECURITY;

CREATE POLICY threads_public_select ON public.threads FOR SELECT USING (true);
CREATE POLICY threads_insert_auth ON public.threads FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = author_id);
CREATE POLICY threads_update_owner ON public.threads FOR UPDATE USING (auth.role() = 'authenticated' AND auth.uid() = author_id) WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = author_id);
CREATE POLICY threads_delete_owner ON public.threads FOR DELETE USING (auth.role() = 'authenticated' AND auth.uid() = author_id);

-- REPLIES
ALTER TABLE public.replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY replies_public_select ON public.replies FOR SELECT USING (true);
CREATE POLICY replies_insert_auth ON public.replies FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = author_id);
CREATE POLICY replies_update_owner ON public.replies FOR UPDATE USING (auth.role() = 'authenticated' AND auth.uid() = author_id) WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = author_id);
CREATE POLICY replies_delete_owner ON public.replies FOR DELETE USING (auth.role() = 'authenticated' AND auth.uid() = author_id);

-- RESOURCES
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY resources_public_select ON public.resources FOR SELECT USING (true);
CREATE POLICY resources_insert_auth ON public.resources FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = author_id);
CREATE POLICY resources_update_owner ON public.resources FOR UPDATE USING (auth.role() = 'authenticated' AND auth.uid() = author_id) WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = author_id);
CREATE POLICY resources_delete_owner ON public.resources FOR DELETE USING (auth.role() = 'authenticated' AND auth.uid() = author_id);

-- CLUBS (no explicit owner column) — allow authenticated users to manage clubs
ALTER TABLE public.clubs ENABLE ROW LEVEL SECURITY;

CREATE POLICY clubs_public_select ON public.clubs FOR SELECT USING (true);
CREATE POLICY clubs_mutation_auth ON public.clubs FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- EVENTS (no explicit owner column) — allow authenticated users to manage events
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY events_public_select ON public.events FOR SELECT USING (true);
CREATE POLICY events_mutation_auth ON public.events FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- TODOS (owned by a user via user_id)
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

CREATE POLICY todos_public_select ON public.todos FOR SELECT USING (true);
CREATE POLICY todos_insert_owner ON public.todos FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);
CREATE POLICY todos_update_owner ON public.todos FOR UPDATE USING (auth.role() = 'authenticated' AND auth.uid() = user_id) WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);
CREATE POLICY todos_delete_owner ON public.todos FOR DELETE USING (auth.role() = 'authenticated' AND auth.uid() = user_id);

-- Helpful: grant select to anon role if you prefer server-managed permissions, but by default
-- Supabase's PostgREST/Realtime will use policies and JWT claims.

-- End of RLS migration
