-- 0001_create_announcements.sql
-- Creates a simple announcements table and inserts a seed row.

CREATE TABLE IF NOT EXISTS announcements (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  message text NOT NULL,
  created_at timestamp NOT NULL DEFAULT now()
);

INSERT INTO announcements (title, message) VALUES
('Welcome', 'Welcome to StudentHubConnect - this is a seeded announcement.');
