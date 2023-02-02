const inquirer = require('inquirer');
const db = require('./db/server');

// start server after connection to DB
db.connect(err => {
  if (err) throw err;
  console.log("Connected to database.");
  employeeTracker();
});

const employeeTracker = function () {
  inquirer.createPromptModule([{
    type: "list",
    name: "prompt",
    // using same message and choices from mock up video provided
    message: "What would you like to do?",
    choices: ["View All Departments", "View All Roles", "View All Employees", "Add Department", "Add Role", "Add Employee", "Update Employee Role"]
  }])