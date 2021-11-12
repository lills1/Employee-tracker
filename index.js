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
    inquirer
        .prompt([
            {
                type: "list",
                message: "What would you like to do?",
                name: "teamMembers",
                choices: ["view all departments", "view all roles", "view all employees", "add a department", "add a role", "add an employee", "update an employee role", "view salaries by department"]
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
                updateRole();
            }
            if (answers.teamMembers === "view salaries by department") {
                viewSalariesByDepartment();
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

}
function addEmployee() {

}
function updateRole() {

}
function viewSalariesByDepartment() {
    db.query("select department.name as \"Department\",sum( salary) as \"Total salaries\" from employee, role, department where employee.role_id=role.id and role.department_id = department.id group by department.name;", function (err, data) {
        console.table(data)
        createList();
    })
}