const inquirer = require('inquirer');
const db = require('./db/connection');

// start server after connection to DB
db.connect(err => {
  if (err) throw err;
  console.log("Connected to database.");
  employeeTracker();
});

const employeeTracker = function () {
  inquirer.prompt([{
    type: "list",
    name: "prompt",
    // using same message and choices from mock up video provided
    message: "What would you like to do?",
    choices: ["View All Departments", "View All Roles", "View All Employees", "Add Department", "Add Role", "Add Employee", "Update Employee Role"]
  }]).then((answers) => {
    // viewing department table in db
    if (answers.prompt === 'View All Departments') {
      db.query(`SELECT * FROM department`, (err, result) => {
        if (err) throw err;
        console.log("Viewing all departments: ");
        console.table(result);
        employeeTracker();
      });
    } else if (answers.prompt === 'View All Roles') {
      db.query(`SELECT * FROM role`, (err, result) => {
        if (err) throw err;
        console.log("Viewing all roles: ");
        console.table(result);
        employeeTracker();
      });
    } else if (answers.prompt === 'View All Employees') {
      db.query(`SELECT * FROM employee`, (err, result) => {
        if (err) throw err;
        console.log("Viewing all employees: ");
        console.table(result);
        employeeTracker();
      });
    } else if (answers.prompt === 'Add Department') {
      inquirer.prompt([{
        type: 'input',
        name: 'department',
        message: 'What is the name of the department?',
        validate: departmentInput => {
          if (departmentInput) {
            return true;
          } else {
            console.log('Please add a department.');
            return false;
          }
        }
      }]).then((answers) => {
        db.query(`INSERT INTO department (name) VALUES (?)`, [answers.department], (err, result) => {
          if (err) throw err;
          console.log(`Added ${answers.department} to the database.`)
          employeeTracker();
        });
      })
    } else if (answers.prompt === 'Add Role') {
      db.query(`SELECT * FROM department`, (err, result) => {
        if (err) throw err;

        inquirer.prompt([
          {
            // add role
            type: 'input',
            name: 'role',
            message: 'What is the name of the role?',
            validate: roleInput => {
              if (roleInput) {
                return true;
              } else {
                console.log('Please add a role.');
                return false;
              }
            }
          },
          {
            // add salary
            type: 'input',
            name: 'salary',
            message: 'What is the salary of the role?',
            validate: salaryInput => {
              if (salaryInput) {
                return true;
              } else {
                console.log('Please add a salary.');
                return false;
              }
            }
          },
          {
            type: 'list',
            name: 'department',
            message: 'Which department does the role belong to?',
            choices: () => {
              var array = [];
              for (var i = 0; i < result.length; i++) {
                array.push(result[i].name);
              }
              return array;
            }
          }
        ]).then((answers) => {
          // Comparing the result and storing it into the variable
          for (var i = 0; i < result.length; i++) {
            if (result[i].name === answers.department) {
              var department = result[i];
            }
          }

          db.query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`, [answers.role, answers.salary, department.id], (err, result) => {
            if (err) throw err;
            console.log(`Added ${answers.role} to the database.`)
            employeeTracker();
          });
        })
      });
    } else if (answers.prompt === 'Add Employee') {
      // call db to acquire the roles and managers
      db.query(`SELECT * FROM employee, role`, (err, result) => {
        if (err) throw err;

        inquirer.prompt([
          {
            // add employee first name
            type: 'input',
            name: 'firstName',
            message: 'What is the employees first name?',
            validate: firstNameInput => {
              if (firstNameInput) {
                return true;
              } else {
                console.log('Please add a first name.');
                return false;
              }
            }
          },
          {
            // add employee last name
            type: 'input',
            name: 'lastName',
            message: 'What is the employees last name?',
            validate: lastNameInput => {
              if (lastNameInput) {
                return true;
              } else {
                console.log('Please add a last name.');
                return false;
              }
            }
          },
          {
            // add employee role
            type: 'list',
            name: 'role',
            message: 'What is the employees role?',
            choices: () => {
              var array = [];
              for (var i = 0; i < result.length; i++) {
                array.push(result[i].title);
              }
              var newArray = [...new Set(array)];
              return newArray;
            }
          },
          {
            // add employee manager
            type: 'input',
            name: 'manager',
            message: 'What is the employee managers id?',
            validate: managerInput => {
              if (managerInput) {
                return true;
              } else {
                console.log('Please add managers ID.');
                return false;
              }
            }
          }
        ]).then((answers) => {
          // compare the result and storing it into the variable
          for (var i = 0; i < result.length; i++) {
            if (result[i].title === answers.role) {
              var role = result[i];
            }
          }

          db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, [answers.firstName, answers.lastName, role.id, answers.manager.id], (err, result) => {
            if (err) throw err;
            console.log(`Added ${answers.firstName} ${answers.lastName} to the database.`)
            employeeTracker();
          });
        })
      });
    } else if (answers.prompt === 'Update Employee Role') {
      // Calling the database to acquire the roles and managers
      db.query(`SELECT * FROM employee, role`, (err, result) => {
        if (err) throw err;

        inquirer.prompt([
          {
            // Choose an Employee to Update
            type: 'list',
            name: 'employee',
            message: 'Which employees role do you want to update?',
            choices: () => {
              var array = [];
              for (var i = 0; i < result.length; i++) {
                array.push(result[i].last_name);
              }
              var employeeArray = [...new Set(array)];
              return employeeArray;
            }
          },
          {
            // Updating the New Role
            type: 'list',
            name: 'role',
            message: 'What is their new role?',
            choices: () => {
              var array = [];
              for (var i = 0; i < result.length; i++) {
                array.push(result[i].title);
              }
              var newArray = [...new Set(array)];
              return newArray;
            }
          }
        ]).then((answers) => {
          for (var i = 0; i < result.length; i++) {
            if (result[i].last_name === answers.employee) {
              var name = result[i];
            }
          }

          for (var i = 0; i < result.length; i++) {
            if (result[i].title === answers.role) {
              var role = result[i];
            }
          }

          db.query(`UPDATE employee SET ? WHERE ?`, [{ role_id: role }, { last_name: name }], (err, result) => {
            if (err) throw err;
            console.log(`Updated ${answers.employee} role to the database.`)
            employeeTracker();
          });
        })
      });
    } else if (answers.prompt === 'Quit') {
      db.end();
      console.log("Bye!");
    }
  })
};