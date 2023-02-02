// Import and require mysql2
const mysql = require('mysql2');

// Connecting to database
const db = mysql.createConnection({
    host: 'localhost',
    // Your MySQL username,
    user: 'root',
    // Your MySQL password
    password: 'password',
    database: 'employeeTracker_db'
});

module.exports = db;