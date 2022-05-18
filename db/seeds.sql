INSERT INTO department (name)
VALUES ("Management"),
("Sales"),
("Engineering"),
("HR")
;

INSERT INTO roles (title, salary, department_id)
VALUES ("Manager", 160000, 1),
("Engineer", 140000, 3),
("Salesperson", 110000, 2),
("HR Representative", 100000, 4)
;

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Glen", "Pak", 1, NULL),
( "Thomas", "Cruz", 3, 1),
( "Marissa", "Peterson", 4, NULL),
( "Raj", "Anand", 2, 1)
;
