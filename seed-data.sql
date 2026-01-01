-- StudentHubConnect - Sample Data for Supabase
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/ktwwwzcyebddkjgdskbd/sql

-- ============================================
-- 1. USERS (Anonymous student profiles)
-- UUID Pattern: 00000000-0000-0000-0000-00000000000X
-- ============================================

INSERT INTO users (id, display_name, academic_year, interests, is_mentor, show_in_discover, created_at) VALUES
('00000000-0000-0000-0000-000000000001', 'Sarah Chen', '3rd Year', ARRAY['Computer Science', 'AI', 'Machine Learning'], true, true, NOW()),
('00000000-0000-0000-0000-000000000002', 'Alice Johnson', '2nd Year', ARRAY['Mathematics', 'Statistics', 'Data Science'], true, true, NOW()),
('00000000-0000-0000-0000-000000000003', 'Bob Smith', '4th Year', ARRAY['Physics', 'Research', 'Study Groups'], true, true, NOW()),
('00000000-0000-0000-0000-000000000004', 'Charlie Davis', '3rd Year', ARRAY['Engineering', 'Robotics', 'Team Projects'], false, true, NOW()),
('00000000-0000-0000-0000-000000000005', 'Emma Wilson', '2nd Year', ARRAY['Biology', 'Research', 'Lab Work'], false, true, NOW());

-- ============================================
-- 2. THREADS (Forum Discussions)
-- UUID Pattern: 00000000-0000-0000-1111-00000000000X
-- ============================================

INSERT INTO threads (id, title, content, category, author_id, is_anonymous, likes_count, created_at, updated_at) VALUES
('00000000-0000-0000-1111-000000000001', 'Best Study Techniques for Finals', 'Hey everyone! Finals are coming up and I wanted to share some study techniques that have worked for me. What are your favorite methods?', 'academic', '00000000-0000-0000-0000-000000000001', false, 24, NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 hours'),
('00000000-0000-0000-1111-000000000002', 'Looking for Study Group - Calculus II', 'Anyone interested in forming a study group for Calc II? We can meet twice a week in the library.', 'academic', '00000000-0000-0000-0000-000000000002', false, 15, NOW() - INTERVAL '5 hours', NOW() - INTERVAL '5 hours'),
('00000000-0000-0000-1111-000000000003', 'Career Fair Tips and Tricks', 'The career fair is next week! Here are some tips that helped me land interviews last year...', 'career', '00000000-0000-0000-0000-000000000003', false, 42, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
('00000000-0000-0000-1111-000000000004', 'Mental Health Resources on Campus', 'Reminder that our campus has free counseling services. Taking care of your mental health is just as important as academics!', 'mental-health', '00000000-0000-0000-0000-000000000004', false, 67, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
('00000000-0000-0000-1111-000000000005', 'Best Coffee Spots Near Campus', 'Where do you all go to study off-campus? Looking for good coffee shops with wifi.', 'social', '00000000-0000-0000-0000-000000000005', false, 31, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day');

-- ============================================
-- 3. REPLIES (Thread Responses)
-- UUID Pattern: 00000000-0000-0000-2222-00000000000X
-- ============================================

INSERT INTO replies (id, thread_id, author_id, content, is_anonymous, created_at) VALUES
('00000000-0000-0000-2222-000000000001', '00000000-0000-0000-1111-000000000001', '00000000-0000-0000-0000-000000000002', 'I find Pomodoro technique really effective for study sessions. 25 minutes of focused work followed by 5-minute breaks helps me stay productive.', false, NOW() - INTERVAL '1 hour 50 minutes'),
('00000000-0000-0000-2222-000000000002', '00000000-0000-0000-1111-000000000001', '00000000-0000-0000-0000-000000000003', 'Also try active recall and spaced repetition. They''re scientifically proven to improve retention!', false, NOW() - INTERVAL '1 hour 48 minutes'),
('00000000-0000-0000-2222-000000000003', '00000000-0000-0000-1111-000000000001', '00000000-0000-0000-0000-000000000004', 'Group study works for me on weekends. We quiz each other and explain concepts.', false, NOW() - INTERVAL '1 hour 45 minutes'),
('00000000-0000-0000-2222-000000000004', '00000000-0000-0000-1111-000000000002', '00000000-0000-0000-0000-000000000001', 'I''m interested! I''m free on Tuesdays and Thursdays after 3pm.', false, NOW() - INTERVAL '4 hours'),
('00000000-0000-0000-2222-000000000005', '00000000-0000-0000-1111-000000000002', '00000000-0000-0000-0000-000000000005', 'Count me in! Let''s create a group chat.', false, NOW() - INTERVAL '3 hours'),
('00000000-0000-0000-2222-000000000006', '00000000-0000-0000-1111-000000000003', '00000000-0000-0000-0000-000000000002', 'Thanks for sharing! I''m definitely going to prepare my elevator pitch.', false, NOW() - INTERVAL '20 hours'),
('00000000-0000-0000-2222-000000000007', '00000000-0000-0000-1111-000000000004', '00000000-0000-0000-0000-000000000001', 'This is so important. Thank you for posting this!', false, NOW() - INTERVAL '2 days'),
('00000000-0000-0000-2222-000000000008', '00000000-0000-0000-1111-000000000005', '00000000-0000-0000-0000-000000000003', 'The Grind Cafe on Main Street is great! Good wifi and not too crowded.', false, NOW() - INTERVAL '18 hours');

-- ============================================
-- 4. RESOURCES (Study Materials)
-- UUID Pattern: 00000000-0000-0000-3333-00000000000X
-- ============================================

INSERT INTO resources (id, title, description, category, file_type, file_url, author_id, downloads, rating, created_at) VALUES
('00000000-0000-0000-3333-000000000001', 'Calculus II Cheat Sheet', 'Comprehensive cheat sheet covering all major topics in Calculus II including integration techniques and series.', 'Study Materials', 'PDF', 'https://example.com/calc2-cheatsheet.pdf', '00000000-0000-0000-0000-000000000002', 156, 4.8, NOW() - INTERVAL '1 week'),
('00000000-0000-0000-3333-000000000002', 'Physics 101 Lab Report Template', 'Template for physics lab reports with proper formatting and sections.', 'Study Materials', 'DOCX', 'https://example.com/physics-template.docx', '00000000-0000-0000-0000-000000000003', 89, 4.5, NOW() - INTERVAL '2 weeks'),
('00000000-0000-0000-3333-000000000003', 'Data Structures Lecture Notes', 'Complete lecture notes from CS 201 - Data Structures and Algorithms.', 'Notes', 'PDF', 'https://example.com/ds-notes.pdf', '00000000-0000-0000-0000-000000000001', 234, 4.9, NOW() - INTERVAL '3 days'),
('00000000-0000-0000-3333-000000000004', 'Chemistry Final Exam Practice', 'Practice problems for Chemistry 102 final exam with solutions.', 'Past Papers', 'PDF', 'https://example.com/chem-practice.pdf', '00000000-0000-0000-0000-000000000005', 178, 4.7, NOW() - INTERVAL '5 days'),
('00000000-0000-0000-3333-000000000005', 'Resume Writing Guide', 'Step-by-step guide to writing an effective resume for tech internships.', 'Career', 'PDF', 'https://example.com/resume-guide.pdf', '00000000-0000-0000-0000-000000000004', 312, 4.9, NOW() - INTERVAL '1 month');

-- ============================================
-- 5. MENTOR PROFILES
-- UUID Pattern: 00000000-0000-0000-4444-00000000000X
-- ============================================

INSERT INTO mentor_profiles (id, user_id, bio, expertise, availability, rating, sessions_completed, created_at) VALUES
('00000000-0000-0000-4444-000000000001', '00000000-0000-0000-0000-000000000003', 'Senior Physics major with 3 years of tutoring experience. Specialized in mechanics and electromagnetism.', ARRAY['Physics', 'Mathematics', 'Problem Solving'], 'Weekdays 4-8pm, Weekends flexible', 4.9, 45, NOW() - INTERVAL '6 months'),
('00000000-0000-0000-4444-000000000002', '00000000-0000-0000-0000-000000000001', 'Computer Science student passionate about teaching programming and algorithms.', ARRAY['Programming', 'Data Structures', 'Algorithms', 'Python', 'Java'], 'Mon/Wed/Fri 6-9pm', 4.8, 32, NOW() - INTERVAL '4 months'),
('00000000-0000-0000-4444-000000000003', '00000000-0000-0000-0000-000000000002', 'Math tutor helping students with calculus and statistics.', ARRAY['Calculus', 'Statistics', 'Linear Algebra'], 'Tue/Thu 5-8pm', 4.7, 28, NOW() - INTERVAL '3 months');

-- ============================================
-- 6. CLUBS (Student Organizations)
-- UUID Pattern: 00000000-0000-0000-5555-00000000000X
-- ============================================

INSERT INTO clubs (id, name, description, category, members_count, created_at) VALUES
('00000000-0000-0000-5555-000000000001', 'Computer Science Society', 'A community for CS students to collaborate on projects, attend workshops, and network with industry professionals.', 'Technology', 156, NOW() - INTERVAL '1 year'),
('00000000-0000-0000-5555-000000000002', 'Math Club', 'Explore advanced mathematics topics, participate in competitions, and help each other with coursework.', 'Academic', 89, NOW() - INTERVAL '2 years'),
('00000000-0000-0000-5555-000000000003', 'Physics Research Group', 'Undergraduate research opportunities and discussions about cutting-edge physics topics.', 'Academic', 67, NOW() - INTERVAL '1 year'),
('00000000-0000-0000-5555-000000000004', 'Engineering Innovation Lab', 'Hands-on projects, robotics competitions, and engineering challenges.', 'Technology', 134, NOW() - INTERVAL '6 months'),
('00000000-0000-0000-5555-000000000005', 'Pre-Med Society', 'Support network for pre-medical students with MCAT prep, volunteer opportunities, and guest speakers.', 'Academic', 201, NOW() - INTERVAL '3 years');

-- ============================================
-- 7. EVENTS (Campus Events)
-- UUID Pattern: 00000000-0000-0000-6666-00000000000X
-- ============================================

INSERT INTO events (id, title, description, date, time, location, attending_count, created_at) VALUES
('00000000-0000-0000-6666-000000000001', 'Tech Career Fair 2026', 'Annual career fair featuring 50+ tech companies recruiting for internships and full-time positions.', '2026-01-15', '10:00:00', 'Student Union Hall', 450, NOW() - INTERVAL '2 weeks'),
('00000000-0000-0000-6666-000000000002', 'Study Skills Workshop', 'Learn effective study techniques, time management, and exam preparation strategies.', '2026-01-08', '18:00:00', 'Library Room 205', 78, NOW() - INTERVAL '1 week'),
('00000000-0000-0000-6666-000000000003', 'Hackathon 2026', '24-hour coding competition with prizes, free food, and networking opportunities.', '2026-01-20', '09:00:00', 'CS Building', 156, NOW() - INTERVAL '3 weeks'),
('00000000-0000-0000-6666-000000000004', 'Mental Health Awareness Week', 'Week-long series of events focused on student mental health and wellness.', '2026-01-10', '12:00:00', 'Campus-wide', 234, NOW() - INTERVAL '10 days'),
('00000000-0000-0000-6666-000000000005', 'Research Symposium', 'Undergraduate research presentations across all disciplines.', '2026-01-25', '13:00:00', 'Main Auditorium', 189, NOW() - INTERVAL '1 month');

-- ============================================
-- 8. CONNECTIONS (User Connections)
-- UUID Pattern: 00000000-0000-0000-7777-00000000000X
-- ============================================

INSERT INTO connections (id, requester_id, target_id, status, created_at) VALUES
('00000000-0000-0000-7777-000000000001', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'accepted', NOW() - INTERVAL '1 month'),
('00000000-0000-0000-7777-000000000002', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 'accepted', NOW() - INTERVAL '2 weeks'),
('00000000-0000-0000-7777-000000000003', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', 'accepted', NOW() - INTERVAL '3 weeks'),
('00000000-0000-0000-7777-000000000004', '00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'accepted', NOW() - INTERVAL '1 week'),
('00000000-0000-0000-7777-000000000005', '00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000002', 'pending', NOW() - INTERVAL '2 days'),
('00000000-0000-0000-7777-000000000006', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000004', 'accepted', NOW() - INTERVAL '5 days');

-- ============================================
-- 9. TODOS (User Tasks)
-- UUID Pattern: 00000000-0000-0000-8888-00000000000X
-- ============================================

INSERT INTO todos (id, user_id, text, completed, created_at) VALUES
('00000000-0000-0000-8888-000000000001', '00000000-0000-0000-0000-000000000001', 'Finish CS project proposal', false, NOW() - INTERVAL '1 day'),
('00000000-0000-0000-8888-000000000002', '00000000-0000-0000-0000-000000000001', 'Study for midterm exam', false, NOW() - INTERVAL '2 hours'),
('00000000-0000-0000-8888-000000000003', '00000000-0000-0000-0000-000000000001', 'Attend career fair', false, NOW() - INTERVAL '3 days'),
('00000000-0000-0000-8888-000000000004', '00000000-0000-0000-0000-000000000002', 'Complete calculus homework', true, NOW() - INTERVAL '1 week'),
('00000000-0000-0000-8888-000000000005', '00000000-0000-0000-0000-000000000002', 'Prepare presentation slides', false, NOW() - INTERVAL '1 day'),
('00000000-0000-0000-8888-000000000006', '00000000-0000-0000-0000-000000000003', 'Lab report due Friday', false, NOW() - INTERVAL '2 days'),
('00000000-0000-0000-8888-000000000007', '00000000-0000-0000-0000-000000000004', 'Team meeting at 3pm', true, NOW() - INTERVAL '5 hours'),
('00000000-0000-0000-8888-000000000008', '00000000-0000-0000-0000-000000000005', 'Review biology notes', false, NOW() - INTERVAL '1 day');

-- ============================================
-- 10. CLUB MEMBERS (Club Memberships)
-- ============================================

INSERT INTO club_members (club_id, user_id, joined_at) VALUES
('00000000-0000-0000-5555-000000000001', '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '1 year'),
('00000000-0000-0000-5555-000000000001', '00000000-0000-0000-0000-000000000002', NOW() - INTERVAL '6 months'),
('00000000-0000-0000-5555-000000000001', '00000000-0000-0000-0000-000000000004', NOW() - INTERVAL '3 months'),
('00000000-0000-0000-5555-000000000002', '00000000-0000-0000-0000-000000000002', NOW() - INTERVAL '2 years'),
('00000000-0000-0000-5555-000000000002', '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '8 months'),
('00000000-0000-0000-5555-000000000003', '00000000-0000-0000-0000-000000000003', NOW() - INTERVAL '1 year'),
('00000000-0000-0000-5555-000000000003', '00000000-0000-0000-0000-000000000005', NOW() - INTERVAL '4 months'),
('00000000-0000-0000-5555-000000000004', '00000000-0000-0000-0000-000000000004', NOW() - INTERVAL '6 months'),
('00000000-0000-0000-5555-000000000004', '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '2 months'),
('00000000-0000-0000-5555-000000000005', '00000000-0000-0000-0000-000000000005', NOW() - INTERVAL '3 years'),
('00000000-0000-0000-5555-000000000005', '00000000-0000-0000-0000-000000000002', NOW() - INTERVAL '1 year');

-- ============================================
-- 11. EVENT ATTENDEES (Fixed table name from event_registrations)
-- ============================================

INSERT INTO event_attendees (event_id, user_id, registered_at) VALUES
('00000000-0000-0000-6666-000000000001', '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '2 weeks'),
('00000000-0000-0000-6666-000000000001', '00000000-0000-0000-0000-000000000002', NOW() - INTERVAL '1 week'),
('00000000-0000-0000-6666-000000000001', '00000000-0000-0000-0000-000000000004', NOW() - INTERVAL '10 days'),
('00000000-0000-0000-6666-000000000002', '00000000-0000-0000-0000-000000000002', NOW() - INTERVAL '1 week'),
('00000000-0000-0000-6666-000000000002', '00000000-0000-0000-0000-000000000003', NOW() - INTERVAL '5 days'),
('00000000-0000-0000-6666-000000000003', '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '3 weeks'),
('00000000-0000-0000-6666-000000000003', '00000000-0000-0000-0000-000000000004', NOW() - INTERVAL '2 weeks'),
('00000000-0000-0000-6666-000000000004', '00000000-0000-0000-0000-000000000005', NOW() - INTERVAL '10 days'),
('00000000-0000-0000-6666-000000000005', '00000000-0000-0000-0000-000000000003', NOW() - INTERVAL '1 month'),
('00000000-0000-0000-6666-000000000005', '00000000-0000-0000-0000-000000000005', NOW() - INTERVAL '3 weeks');

-- ============================================
-- 12. THREAD LIKES
-- ============================================

INSERT INTO thread_likes (thread_id, user_id, created_at) VALUES
('00000000-0000-0000-1111-000000000001', '00000000-0000-0000-0000-000000000002', NOW() - INTERVAL '1 hour'),
('00000000-0000-0000-1111-000000000001', '00000000-0000-0000-0000-000000000003', NOW() - INTERVAL '2 hours'),
('00000000-0000-0000-1111-000000000001', '00000000-0000-0000-0000-000000000004', NOW() - INTERVAL '1 hour 30 minutes'),
('00000000-0000-0000-1111-000000000002', '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '4 hours'),
('00000000-0000-0000-1111-000000000002', '00000000-0000-0000-0000-000000000005', NOW() - INTERVAL '3 hours'),
('00000000-0000-0000-1111-000000000003', '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '1 day'),
('00000000-0000-0000-1111-000000000003', '00000000-0000-0000-0000-000000000002', NOW() - INTERVAL '20 hours'),
('00000000-0000-0000-1111-000000000004', '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '2 days'),
('00000000-0000-0000-1111-000000000004', '00000000-0000-0000-0000-000000000002', NOW() - INTERVAL '2 days'),
('00000000-0000-0000-1111-000000000004', '00000000-0000-0000-0000-000000000003', NOW() - INTERVAL '3 days'),
('00000000-0000-0000-1111-000000000005', '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '1 day'),
('00000000-0000-0000-1111-000000000005', '00000000-0000-0000-0000-000000000003', NOW() - INTERVAL '18 hours');

-- ============================================
-- 13. MENTORSHIP REQUESTS
-- UUID Pattern: 00000000-0000-0000-9999-00000000000X
-- ============================================

INSERT INTO mentorship_requests (id, mentor_profile_id, student_id, message, status, created_at) VALUES
('00000000-0000-0000-9999-000000000001', '00000000-0000-0000-4444-000000000001', '00000000-0000-0000-0000-000000000005', 'Hi! I need help with physics mechanics. Can we schedule a session?', 'accepted', NOW() - INTERVAL '1 week'),
('00000000-0000-0000-9999-000000000002', '00000000-0000-0000-4444-000000000002', '00000000-0000-0000-0000-000000000004', 'Looking for help with data structures and algorithms for upcoming interviews.', 'pending', NOW() - INTERVAL '2 days'),
('00000000-0000-0000-9999-000000000003', '00000000-0000-0000-4444-000000000003', '00000000-0000-0000-0000-000000000001', 'Need help preparing for calculus final exam.', 'accepted', NOW() - INTERVAL '3 days');

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_threads FROM threads;
SELECT COUNT(*) as total_replies FROM replies;
SELECT COUNT(*) as total_resources FROM resources;
SELECT COUNT(*) as total_mentors FROM mentor_profiles;
SELECT COUNT(*) as total_clubs FROM clubs;
SELECT COUNT(*) as total_events FROM events;
SELECT COUNT(*) as total_connections FROM connections;
SELECT COUNT(*) as total_todos FROM todos;

COMMIT;
