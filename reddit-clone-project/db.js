const mysql = require('mysql');

let conn = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

conn.connect((error) => {
  if (error) {
    console.log(error);
    return;
  }
  console.log(`Connection to DB ${process.env.DB_NAME} on MySQL is succesful!`);
});

module.exports = conn;
