const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Archie@1411",   // 👉 your MySQL password
  database: "attendance_system"
});

db.connect((err) => {
  if (err) {
    console.log("DB Connection Failed ❌", err);
  } else {
    console.log("MySQL Connected ✅");
  }
});

module.exports = db;