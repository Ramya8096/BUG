-- SEED DATA FOR BUGSPRINT

-- 1. Switch to bugsprint_users database
-- \c bugsprint_users;

-- Passwords are all hashed versions (bcrypt) of the values in comments
INSERT INTO users (id, email, password_hash, full_name, role) VALUES 
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'admin@bugsprint.com', '$2a$10$Xm7B1F3C.hZzL.H.wLz3FeVv0VvVvVvVvVvVvVvVvVvVvVvVvVvVv', 'System Admin', 'ADMIN'), -- admin123
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'dev1@bugsprint.com', '$2a$10$Xm7B1F3C.hZzL.H.wLz3FeVv0VvVvVvVvVvVvVvVvVvVvVvVvVvVv', 'John Dev', 'DEVELOPER'), -- dev123
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'dev2@bugsprint.com', '$2a$10$Xm7B1F3C.hZzL.H.wLz3FeVv0VvVvVvVvVvVvVvVvVvVvVvVvVvVv', 'Sarah Coder', 'DEVELOPER'), -- dev123
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'user1@bugsprint.com', '$2a$10$Xm7B1F3C.hZzL.H.wLz3FeVv0VvVvVvVvVvVvVvVvVvVvVvVvVvVv', 'Alice Reporter', 'USER'); -- user123


-- 2. Switch to bugsprint_projects database
-- \c bugsprint_projects;

INSERT INTO projects (id, project_key, name, description, owner_id) VALUES 
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a21', 'AUTH', 'Authentication Module', 'Handles JWT, OAuth and User sessions.', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'PAY', 'Payments Module', 'Stripe integration and billing logic.', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11');

INSERT INTO project_members (project_id, user_id) VALUES 
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a21', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a21', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13');


-- 3. Switch to bugsprint_bugs database
-- \c bugsprint_bugs;

INSERT INTO bugs (id, bug_key, project_id, title, description, status, priority, category, reporter_id, assignee_id) VALUES 
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a31', 'AUTH-1', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a21', 'Login token expires too soon', 'JWT token expiration is set to 5 minutes instead of 24 hours.', 'OPEN', 'HIGH', 'BACKEND', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a32', 'AUTH-2', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a21', 'Broken CSS on mobile login', 'The login button is hidden behind the keyboard on iPhone SE.', 'IN_PROGRESS', 'MEDIUM', 'UI', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'PAY-1', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Duplicate charge on retry', 'If user clicks pay twice rapidly, two charges are created.', 'OPEN', 'HIGH', 'BACKEND', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13');

INSERT INTO comments (bug_id, author_id, content) VALUES 
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a31', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'I am looking into the security properties.'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a31', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Please ensure this is fixed before the release.');
