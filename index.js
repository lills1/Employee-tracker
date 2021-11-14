const inquirer = require("inquirer");
const fs = require("fs");
const mysql = require("mysql2");
const table = require("console.table");
const db = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "FizzBuzz1",
    database: "employee_db"
})
db.connect(function (err) {
    if (err) throw err
    createList()
})
function createList() {
    //seed cache
    fetchEmployees();
    fetchDepartments();
    fetchRoles();
    inquirer
        .prompt([
            {
                type: "list",
                message: "What would you like to do?",
                name: "teamMembers",
                choices: ["view all departments", "view all roles", "view all employees", "add a department", "add a role", "add an employee", "update an employee role", "view salaries by department", "view employee by manager", "view employee by department", "update manager", "delete employee", "delete department", "delete role"]
            }
        ])

        .then((answers) => {
            // console.log(answers);
            if (answers.teamMembers === "view all departments") {
                viewDepartments();
            }
            if (answers.teamMembers === "view all roles") {
                viewRoles();
            }
            if (answers.teamMembers === "view all employees") {
                viewEmployees();
            }
            if (answers.teamMembers === "add a department") {
                addDepartment();
            }
            if (answers.teamMembers === "add a role") {
                addRole();
            }
            if (answers.teamMembers === "add an employee") {
                addEmployee();
            }
            if (answers.teamMembers === "update an employee role") {
                //seed cache
                fetchEmployees();
                updateRole();
            }
            if (answers.teamMembers === "view salaries by department") {
                viewSalariesByDepartment();
            }
            if (answers.teamMembers === "view employee by manager") {
                viewEmployeesByManager();
            }
            if (answers.teamMembers === "view employee by department") {
                viewEmployeesByDepartment();
            }
            if (answers.teamMembers === "update manager") {
                updateManager();
            }
            if (answers.teamMembers === "delete employee") {
                deleteEmployee();
            }
            if (answers.teamMembers === "delete department") {
                deleteDepartment();
            }
            if (answers.teamMembers === "delete role") {
                deleteRole();
            }
        });
}
function viewDepartments() {
    db.query("select * from department", function (err, data) {
        console.table(data)
        createList();
    })
}
function viewRoles() {
    db.query("select* from role", function (err, data) {
        console.table(data)
        createList();
    })
}
function viewEmployees() {
    db.query("select * from employee", function (err, data) {
        console.table(data)
        createList();
    })
}
function addDepartment() {
    inquirer
        .prompt(
            [
                {
                    type: "input",
                    name: "departmentName",
                    message: "What is your department you want to add?"
                }
            ]
        )
        .then(function (answers) {
            db.query("insert into department(name) values(?)", [answers.departmentName], function (err, data) {
                console.log("Your department has been added")
                createList();
            })
        })
}
function addRole() {
    inquirer
        .prompt(
            [
                {
                    type: "input",
                    name: "RoleName",
                    message: "What is the role you want to add?"
                },

                {
                    type: "input",
                    name: "Salary",
                    message: "What is the salary of the role?"
                },
                {
                    type: "list",
                    name: "whichDepartment",
                    message: "What department does this role fit within?",
                    choices: fetchDepartments()
                }
            ]
        )
        .then(function (answers) {
            db.query("insert into role(title, salary, department_id) values(?,?,(select id from department where department.name=?))", [answers.RoleName, answers.Salary, answers.whichDepartment], function (err, data) {
                if (err) {
                    console.log('err while creating employee ', err);
                }
                else {
                    console.log("Your employee has been added");
                }
                createList();
            })
        })
}
function addEmployee() {
    inquirer
        .prompt(
            [
                {
                    type: "input",
                    name: "employeeFirstName",
                    message: "What is the employee's first name?"
                },
                {
                    type: "input",
                    name: "employeeLastName",
                    message: "What is the employee's last name?"
                },
                {
                    type: "list",
                    name: "employeeRole",
                    message: "What is the employee's role?",
                    choices: fetchRoles()
                }
            ]
        )
        .then(function (answers) {
            let role_id = fetchRoleByTitle(answers.employeeRole);
            console.log(role_id);
            db.query("insert into employee(first_name, last_name, role_id) values(?,?,(select id from role where role.title=?))", [answers.employeeFirstName, answers.employeeLastName, answers.employeeRole], function (err, data) {
                if (err) {
                    console.log('err while creating employee ', err);
                }
                else {
                    console.log("Your employee has been added");
                }
                createList();
            })
        })
}

function updateRole() {
    //seed cache
    fetchEmployees();
    fetchRoles();
    inquirer
        .prompt(
            [
                {
                    type: "list",
                    name: "whichEmployee",
                    message: "Which employee's role do you want to update?",
                    choices: fetchEmployees()
                },
                {
                    type: "list",
                    name: "whichRole",
                    message: "Which role do you want to assign this employee?",
                    choices: fetchRoles()
                }
            ]
        )
        .then(function (answers) {
            db.query("update employee set role_id=( select id from role where role.title=? ) where employee.id=( select a from ( select e2.id as a from employee as e2 where concat (first_name, \" \", last_name) =? ) as x )", [answers.whichRole, answers.whichEmployee], function (err, data) {
                if (err) {
                    console.log('err while updating employee ', err);
                }
                else {
                    console.log("Your role has been updated");
                }
                createList();
            })
            // console.log("todo then");
        })
}

function updateManager() {
    //seed cache
    fetchEmployees();
    fetchRoles();
    inquirer
        .prompt(
            [
                {
                    type: "list",
                    name: "whichEmployee",
                    message: "Which employee's manager do you want to change?",
                    choices: fetchEmployees()
                },
                {
                    type: "list",
                    name: "whichManager",
                    message: "Which employee is now the manager?",
                    choices: fetchEmployees()
                }
            ]
        )
        .then(function (answers) {
            db.query("update employee set manager_id=( select a from ( select e2.id as a from employee as e2 where concat (first_name, \" \", last_name) =? ) as x ) where employee.id=( select a from ( select e2.id as a from employee as e2 where concat (first_name, \" \", last_name) =? ) as y )", [answers.whichManager, answers.whichEmployee], function (err, data) {
                if (err) {
                    console.log('err while updating employee ', err);
                }
                else {
                    console.log("Your role has been updated");
                }
                createList();
            })
            // console.log("todo then");
        })
}


function deleteEmployee() {
    //seed cache
    fetchEmployees();
    fetchRoles();
    inquirer
        .prompt(
            [
                {
                    type: "list",
                    name: "whichEmployee",
                    message: "Which employee do you want to delete?",
                    choices: fetchEmployees()
                }
            ]
        )
        .then(function (answers) {
            db.query("delete from employee where id=(select a from ( select e2.id as a from employee as e2 where concat (first_name, \" \", last_name) =? ) as x )", [answers.whichEmployee], function (err, data) {
                if (err) {
                    console.log('err while deleting employee ', err);
                }
                else {
                    console.log("Your employee has been deleted");
                }
                createList();
            })
            // console.log("todo then");
        })
}


function deleteDepartment() {
    //seed cache
    fetchDepartments();
    inquirer
        .prompt(
            [
                {
                    type: "list",
                    name: "whichDepartment",
                    message: "Which department do you want to delete?",
                    choices: fetchDepartments()
                }
            ]
        )
        .then(function (answers) {
            db.query("delete from department where id=( select a from (select department.id as a from department where name=?)as x)", [answers.whichDepartment], function (err, data) {
                if (err) {
                    console.log('err while deleting department ', err);
                }
                else {
                    console.log("Your department has been deleted");
                }
                createList();
            })
            // console.log("todo then");
        })
}

function deleteRole() {
    //seed cache
    fetchRoles();
    inquirer
        .prompt(
            [
                {
                    type: "list",
                    name: "whichRole",
                    message: "Which role do you want to delete?",
                    choices: fetchRoles()
                }
            ]
        )
        .then(function (answers) {
            db.query("delete from role where id=( select a from (select role.id as a from role where title=?)as x)", [answers.whichRole], function (err, data) {
                if (err) {
                    console.log('err while deleting role ', err);
                }
                else {
                    console.log("Your role has been deleted");
                }
                createList();
            })
            // console.log("todo then");
        })
}

function viewEmployeesByManager() {
    inquirer
        .prompt(
            [
                {
                    type: "list",
                    name: "ManagersName",
                    message: "What is the managers name?",
                    choices: fetchEmployees()
                }
            ]
        )
        .then(function (answers) {

            db.query("select * from employee where manager_id=(select employee.id from employee where concat (first_name, \" \", last_name)=?);", [answers.ManagersName], function (err, rows) {
                if (err) {
                    console.log('err while updating employee ', err);
                }
                else {
                    console.table(rows);
                }
                createList();
            })
        })
}
function viewEmployeesByDepartment() {
    fetchDepartments();
    inquirer
        .prompt(
            [
                {
                    type: "list",
                    name: "DepartmentName",
                    message: "What is the department name?",
                    choices: fetchDepartments()
                }
            ]
        )
        .then(function (answers) {

            db.query("select * from employee where role_id in (select role.id from role where role.department_id = (select department.id from department where name=?));", [answers.DepartmentName], function (err, rows) {
                if (err) {
                    console.log('err while fetching employees ', err);
                }
                else {
                    console.table(rows);
                }
                createList();
            })
        })
}

//todo: function to get all employees
global.employees_list = [];
function fetchEmployees() {
    //console.log("entered fetch employees!!")

    //console.log("starting employees1:" + employees_list);
    db.query("select concat (first_name, \" \", last_name) as name from employee;", function (err, rows) {
        // console.table(data)
        //console.log("starting employees:" + employees_list);
        if (err) {
            console.log('err while creating employee ', err);
        }
        else {
            // console.log("Your employee has been added");
            global.employees_list = [];
            for (var i = 0; i < rows.length; i++) {
                //console.log(rows[i]);
                global.employees_list.push(rows[i].name);
            }
            //console.log("employees:" + global.employees_list);
            return global.employees_list;
        }

    });
    //console.log("Final employees:" + global.employees_list);


    return global.employees_list;
}



//todo: function to get all roles
global.all_roles = []
function fetchRoles() {
    // console.log("entered roles")

    db.query("select title from role;", function (err, rows) {
        // console.table(data)
        global.all_roles = []
        for (var i = 0; i < rows.length; i++) {
            //console.log(rows[i]);
            global.all_roles.push(rows[i].title);
        }
        // console.log("titles:" + titles);
        return global.all_roles;
    })
    // console.log("Final titles:" + titles);
    return global.all_roles;
}



global.departmentNames = []
function fetchDepartments() {
    // console.log("entered roles")
    //let names = [];
    db.query("select name from department order by name;", function (err, rows) {
        if (err) {
            console.log('err while creating employee ', err);
        }
        else {

            // console.table(data)
            global.departmentNames = []
            for (var i = 0; i < rows.length; i++) {
                //console.log(rows[i]);
                departmentNames.push(rows[i].name);
            }
        }
        // console.log("titles:" + titles);
        return departmentNames;
    })
    // console.log("Final titles:" + titles);
    return departmentNames;
}




// function fetchRoles() {
//     // console.log("entered roles")
//     let titles = [];
//     db.query("select title from role order by title;", function (err, rows) {
//         // console.table(data)
//         for (var i = 0; i < rows.length; i++) {
//             //console.log(rows[i]);
//             titles.push(rows[i].title);
//         }
//         // console.log("titles:" + titles);
//         return titles;
//     })
//     // console.log("Final titles:" + titles);
//     return titles;
// }


function fetchRoleByTitle(title) {
    let id = -1;
    db.query("select id from role where title=?;", title, function (err, rows) {
        // console.table(data)
        // for (var i = 0; i < rows.length; i++) {
        //     console.log(rows[i]);
        //     titles.push(rows[i].title);
        // }
        // console.log("titles:" + titles);
        id = rows[0].id;
        console.log("Number:" + id);
        return id;
    })
    //console.log("Final id:" + id);
    //return id;
}


function viewSalariesByDepartment() {
    db.query("select department.name as \"Department\",sum( salary) as \"Total salaries\" from employee, role, department where employee.role_id=role.id and role.department_id = department.id group by department.name;", function (err, data) {
        console.table(data)
        createList();
    })
}
