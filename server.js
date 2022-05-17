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
            else if (data.startSelect === 'Exit'){
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

init ();