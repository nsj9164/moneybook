const mysql = require('mysql');

const conn = mysql.createConnection({
    host: '127.0.0.1',
    port: '3306',
    user: 'root',
    password: 'root',
    database: 'mydb'
    // host: process.env.DB_HOST,
    // port: process.env.DB_PORT,
    // user: process.env.DB_USER,
    // password: process.env.DB_PASSWORD,
    // database: process.env.DB_NAME
});

conn.connect((err) => {
    if (err) console.log(err);
    else console.log('Connected to the database');
});

module.exports = conn;