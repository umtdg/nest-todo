--  Sample users
INSERT INTO users (id, email, password, createdAt, updatedAt) VALUES
(UUID(), 'john.doe@localhost', '$2b$12$STAXk0JUjngEszGKCBHeVuc/rY1jUvdPt699uRRDdCjMVPqh4txfa', NOW(), NOW()),
(UUID(), 'jane.doe@localhost', '$2b$12$fuLZr6RU.9F2PvhstJ8G4.mkG8m4CgOLB.BS0sEQxO5FqJjx1wM6u', NOW(), NOW()),
(UUID(), 'example@example.org', '$2a$10$721mbSd2cegYfxC4pXpuMen0tszEed7ch4OatmKxgypy0Qzdu/tQu', NOW(), NOW());

--  Sample tasks
INSERT INTO tasks (title, description, assignee) VALUES
('Task 1 - john.doe', 'Description for Task 1', 1),
('Task 2 - jane.doe', 'Description for Task 2', 2),
('Task 3 - john.doe', 'Description for Task 3', 1),
('Task 4 - john.doe', 'Description for Task 4', 1),
('Task 5 - john.doe', 'Description for Task 5', 1),
('Task 6 - jane.doe', 'Description for Task 6', 2),
('Task 7 - jane.doe', 'Description for Task 7', 2),
('Task 8 - john.doe', 'Description for Task 8', 1),
('Task 9 - jane.doe', 'Description for Task 9', 2),
('Task 10 - jane.doe', 'Description for Task 10', 2);

-- Valid sub-tasks
INSERT INTO tasks (title, description, assignee, parentTask) VALUES
('Task 11 - john.doe', 'Sub-task for Task 1', 1, 1),
('Task 12 - jane.doe', 'Sub-task for Task 2', 2, 2),
('Task 13 - john.doe', 'Sub-task for Task 3', 1, 3),
('Task 14 - john.doe', 'Sub-task for Task 3', 1, NULL);

-- Invalid sub-tasks

--  Sub-task of itself
UPDATE tasks SET parentTask = 1 WHERE taskId = 1;

--  Sub-task of another user's task
INSERT INTO tasks (title, description, assignee, parentTask) VALUES
('Task 15 - john.doe', 'Sub-task for Task 2', 1, 2);
UPDATE Tasks SET parentTask = 2 WHERE taskId = 1;

INSERT INTO jwt_blacklist (token, expiresAt) VALUES
("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImV4YW1wbGVAZXhhbXBsZS5vcmciLCJzdWIiOiI3ZWNhMjNiOC0xOTQ1LTExZWYtYjVmMy0wMDE1NWRkZTQ1YzQiLCJpYXQiOjE3MTY1NzIwMDUsImV4cCI6MTcxNjU3MjA2NX0.sV5tE7ohfaSp4As_b3n9i-AwSVwTwJ0vnShVu4LCj9I", NOW())
