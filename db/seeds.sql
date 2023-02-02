-- Inserts names of departments into the department table
INSERT INTO department
  (name)
VALUES
  ('Engineering'),
  ('Customer Service'),
  ('HR'),
  ('IT');

-- Inserts roles of employee into the role table
INSERT INTO role
  (title, salary, department_id)
VALUES
  ('Software Engineer', 152000, 1),
  ('Customer Success Specialist', 62000, 2),
  ('Human Resource Associate', 73000, 3),
  ('IT Specalist', 82000, 4);

-- Inserts employee information into the employee table
INSERT INTO employee
  (first_name, last_name, role_id, manager_id)
VALUES
  ('Louis', 'Kim', 1, 6),
  ('Jeff', 'Bezos', 2, 1),
  ('Michael', 'Jordan', 3, 3),
  ('Curious', 'George', 4, 5);