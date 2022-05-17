INSERT INTO department (name)
VALUES ("Shipping"),
("Management"),
("Production"),
("QA")
;

INSERT INTO roles (title, salary, department_id)
VALUES ("Manager", 120000, 3),
("Assistant Manager", 100000, 1),
("Key Grip", 200000, 2),
("Director", 400000, 4)
;

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Margo", "Melanija", 4, NULL),
( "Clara", "Olov", 3, 1),
( "Marija", "Glen", 2, NULL),
( "Sung-Hyun", "Woodcock", 1, 2)
;