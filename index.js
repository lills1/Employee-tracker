const inquirer = require("inquirer");
const fs = require("fs");

function createList() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "What would you like to do?",
                name: "teamMembers",
                choices: ["view all departments", "view all roles", "view all employees", "add a department", "add a role", "add an employee", "update an employee role"]
            }
        ])

        .then((answers) => {
            console.log(answers);
        });
}
createList();