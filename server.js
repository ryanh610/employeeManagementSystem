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
