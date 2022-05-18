const mysql = require('mysql2');
const consoleTable = require('console.table');
const inquirer = require('inquirer');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'Admin&me2',
        database: 'employees_db'
    },
    console.log(`DB connection established successfully!`)
);

db.connect((err) => {
    if (err) {
      return console.error('error: ' + err.message);
    }
});

function init() {
    inquirer
        .prompt(
            {
                type: 'list',
                name: 'startSelect',
                message: 'What do you wish to do?',
                choices: ['View Departments', 'View Roles', 'View Employees', 'Add a department', 'Add a role', 'Add an employee', "Update an employee's role", 'Exit']
                
            }
        )
        .then((data) => {
            if (data.startSelect === 'View Departments') {
                viewDepartment();
            } 
            else if (data.startSelect === 'View Roles') {
                viewRoles();
            } 
            else if (data.startSelect === 'View Employees') {
                viewEmployees();
            } 
            else if (data.startSelect === 'Add a department') {
                addDepartment();
            } 
            else if (data.startSelect === 'Add a role') {
                addRole();
            } 
            else if (data.startSelect === 'Add an employee') {
                addEmployee();
            }
            else if (data.startSelect === "Update an employee's role") {
                roleUpdate();
                return ;
            }
            else if (data.startSelect === 'Exit'){
                console.log("Bye!");
                process.exit();
            }
        }
    );
};

function viewDepartment() {
    db.query('SELECT * FROM department', (err, data) => {
        if (err) throw err;
        console.table(data);
        init();
    })
};

function viewRoles() {
    db.query('SELECT * FROM roles', (err, data) => {
        if (err) throw err;
        console.table(data);
        init();
    })
};

function viewEmployees() {
    db.query('SELECT * FROM employee', (err, data) => {
        if (err) throw err;
        console.table(data);
        init();
    })
};

function addDepartment() {
    const departmentQuestion = [{
        type: 'input',
        name: 'deptName',
        message: 'Please enter the name of the new department.'
    }];
    inquirer
        .prompt(departmentQuestion)
        .then((data) => {
            db.query('INSERT INTO department (name) VALUES (?)', [data.departmentName], (err, result) => {
                console.log(data.departmentName);
                init();
            })
        })
};

function addRole() {
    const departmentArray = [];
    
    db.query('SELECT * FROM department', (err, result) => {
        for (i = 0; i < result.length; i++) {
            departmentArray.push(result[i].name)
        }
    });
    inquirer
    .prompt([
        {
        type: 'input',
        name: 'roleName',
        message: 'Enter Role Name:'
        },  
        {type: 'input',
        name: 'roleSalary',
        message: 'Enter Role Salary:'
        },  
        {
        type: 'list',
        name: 'roleDepartment',
        message: 'Enter Role Department',
        choices: departmentArray
        }
    ])
    .then((data) => {
        db.query('SELECT * FROM department', (err, results) => {
            let deptId = 0;
            for (i=0; i<results.length; i++) {
                if (data.roleDept === results[i].name){
                    deptId = results[i].id
                }
            }
            db.query('INSERT INTO roles (title,salary,department_id) VALUES (?,?,?)', [data.roleName, data.roleSalary, deptId], (err, result) => {
                console.log('New role added.');
                console.log(data.roleName, data.roleSalary, deptId);
                init();
            })
        });
    }) 
};

function addEmployee() {
    const roleArray = [];
    
    db.query('SELECT * FROM roles', (err, result) => {
        for (i = 0; i < result.length; i++) {
            roleArray.push(result[i].title)
        }
    });

    const managerArray = [];

    db.query('SELECT first_name, last_name FROM employee', (err, result) => {
        for (i = 0; i < result.length; i++) {
            let managerName = result[i].first_name + ' ' + result[i].last_name;
            managerArray.push(managerName)
        }
    });
    
    inquirer
    .prompt([{
        type: 'input',
        name: 'firstName',
        message: 'Please enter the first name of the new employee.'
        },
        {
        type: 'input',
        name: 'lastName',
        message: 'Please enter the last name of the new employee.'
        },
        {
        type: 'list',
        name: 'role',
        message: 'Please enter the role of the new employee.',
        choices: roleArray
        },
        {
        type: 'list',
        name: 'manager',
        message: 'Please enter the name of the manager of the new employee.',
        choices: managerArray
        }
    ])
    .then((data) => {

        db.query('SELECT * FROM roles', (err, results) => {
            let roleId = 0;
            for (i=0; i < results.length; i++) {
                if (data.role === results[i].title){
                    roleId = results[i].id
                }
            }
            db.query('SELECT * FROM employee', (err, results) => {
                const manager = data.manager.split(" ");
                let managerID = null;
                for (i=0; i < results.length; i++) {
                    console.log(results[i])
                    if (manager[0] === results[i].first_name && manager[1] === results[i].last_name){
                        managerID=results[i].id
                    }
                } 
                db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)', [data.firstName, data.lastName, roleId, managerID], (err, result) => {
                    console.log('New employee added.');
                    init();
                });
            });
        });
    }) 
};

function roleUpdate() {
    const employeeArray = [];

    db.query('SELECT first_name, last_name FROM employee', (err, result) => {
        for (i = 0; i < result.length; i++) {
            let name = result[i].first_name + ' ' + result[i].last_name;
            employeeArray.push(name)
            
        }
    });
    const roleArray = [];
    
    db.query('SELECT * FROM roles', (err, result) => {
        for (i = 0; i < result.length; i++) {
            roleArray.push(result[i].title)
        }
    });
    
    inquirer
    .prompt([
        {
            type: 'list',
            message: 'What is their new role?',
            name: 'role',
            choices: roleArray
        },
        {
            type: 'list',
            message: 'Which employee needs their role amended?',
            name: 'name',
            choices: employeeArray
        }
        
    ])
        .then((data) => {
            let newTitle = data.empRole;
            db.query('SELECT * FROM roles', (err, results) => {
                let newRoleId = 0;
                for (i=0; i<results.length; i++) {
                    if (newTitle === results[i].title){
                        newRoleId = results[i].id;
                        
                    }
                }
                const updatedEmployee = data.name.split(" ");
                db.query('SELECT * FROM employee', (err, results) => {
                    if (err) {
                        console.log(err)
                    }

                    let employeeID = 0
                    for (i = 0; i < results.length; i++) {
                        if (updatedEmployee[0] === results[i].first_name && updatedEmployee[1] === results[i].last_name) {
                            console.log(results);
                            employeeID = results[i].id;
                        }
                    }
                    db.query('UPDATE employee SET role_id = ? WHERE id = ?', [newRoleId, employeeID], (err, results) => {
                        console.log(results);
                        init();
                    })
                })
        })
    });
};

init ();