const mysql = require("mysql");
require("dotenv").config();

const conn = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

console.log(
  process.env.DB_HOST,
  process.env.DB_PORT,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  process.env.DB_NAME
);

conn.connect((err) => {
  if (err) console.log(err);
  else console.log("Connected to the database");
});

module.exports = conn;
