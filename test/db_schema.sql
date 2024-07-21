DROP DATABASE IF EXISTS todoapp_db;
CREATE DATABASE todoapp_db;

USE todoapp_db;

DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password CHAR(60) NOT NULL,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE jwt_blacklist (
  id INT PRIMARY KEY AUTO_INCREMENT,
  token VARCHAR(255) NOT NULL UNIQUE,
  expiresAt TIMESTAMP NOT NULL
);

CREATE TABLE tasks (
	id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description VARCHAR(4096),
  status VARCHAR(255) NOT NULL DEFAULT 'TODO',
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  assigneeId VARCHAR(36) NOT NULL,
  parentTaskId VARCHAR(36) DEFAULT NULL,
  FOREIGN KEY (assigneeId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (parentTaskId) REFERENCES tasks(id) ON DELETE CASCADE
);

DELIMITER $$

-- Trigger to prevent a task from being set as a sub-task of itself
DROP TRIGGER IF EXISTS task_parent_check$$
CREATE TRIGGER task_parent_check
BEFORE UPDATE ON tasks
FOR EACH ROW BEGIN
  IF NEW.parentTaskId = NEW.id THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cannot set task as sub-task of itself';
  END IF;
END$$

-- Trigger to prevent a task from being set as a sub-task of another user's task
DROP PROCEDURE IF EXISTS check_task_parent_assignee$$
CREATE PROCEDURE check_task_parent_assignee(IN parentTaskId VARCHAR(36), IN newAssignee VARCHAR(36))
this_proc: BEGIN
  DECLARE parentAssignee VARCHAR(36);

  IF parentTaskId IS NULL THEN
    LEAVE this_proc;
  END IF;

  SELECT assigneeId INTO parentAssignee FROM tasks WHERE id = parentTaskId;
  IF parentAssignee IS NULL THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Parent task does not exist';
  END IF;
  IF parentAssignee IS NOT NULL AND parentAssignee != newAssignee THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'A task cannot have a parent task assigned to another user';
  END IF;
END$$

DROP TRIGGER IF EXISTS task_parent_assignee_insert_check$$
CREATE TRIGGER task_parent_assignee_insert_check
BEFORE INSERT ON tasks
FOR EACH ROW BEGIN
  CALL check_task_parent_assignee(NEW.parentTaskId, NEW.assigneeId);
END$$

DROP TRIGGER IF EXISTS task_parent_assignee_update_check$$
CREATE TRIGGER task_parent_assignee_update_check
BEFORE UPDATE ON tasks
FOR EACH ROW BEGIN
  CALL check_task_parent_assignee(NEW.parentTaskId, NEW.assigneeId);
END$$

DELIMITER ;
