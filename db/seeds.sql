USE employee_db;
INSERT INTO department (name)
VALUES
    ("Sales"),
    ("Finance"),
    ("Engineering"),
    ("Legal"),
    ("Management");

INSERT INTO role ( title, salary, department_id)
VALUES
    ("Sales lead", "100000", 1),
    ("Salesperson", "80000", 1),
    ("Lead engineer", "150000", 3),
    ("Software engineer", "120000", 3),
    ( "Account manager", "160000", 2),
    ( "Accountant", "125000", 2),
    ( "legal team lead", "250000", 4),
    ( "Lawyer", "190000", 4),
    ( "CEO", "250000",5);
  --select on emplpoyee, role snd dept grouping by department_name and sum on salary 

INSERT INTO employee (first_name, last_name, role_id)
VALUES
    ("Lilly", "Stephenson",1),
    ("John", "Doe",2),
    ("Mike", "Chan", 3),
    ("Tom", "Allen",4 ),
    ("Kim", "Kardashian", 5),
    ("Ronald", "McDonald",6),
    ("Mike", "Wazowski", 7),
    ("Bo", "Peep",8),
    ("Cody", "Maverick", 9);
UPDATE employee SET manager_id=9 WHERE id!=9;