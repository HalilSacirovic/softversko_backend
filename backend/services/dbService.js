const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "e-hub-db",
});

db.connect((err) => {
  if (err) {
    console.error("Greška pri povezivanju sa bazom:", err);
  } else {
    console.log("Uspešno povezano sa MySQL bazom!");
  }
});

module.exports = db;
