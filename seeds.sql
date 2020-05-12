USE employerTrackerDB; 

INSERT INTO employees (id, first_name, last_name, role_id, manager_id)
VALUES (1, "Jacqueline", "Tessmer", 1, 1);

INSERT INTO employees (id, first_name, last_name, role_id, manager_id)
VALUES (2, "Stephanie", "Lorenzini", 2, 1);

INSERT INTO employees (id, first_name, last_name, role_id, manager_id)
VALUES (4, "Donovan", "Compton", 3, 2);

INSERT INTO role (id, title, salary, department_id)
VALUES (4, "Mechanic", 30000, 3);

INSERT INTO department (id, division)
VALUES (4, "Auto Service");