const { connection } = require("../config/db");

// create user table
const createStudentsTable = () => {
  const sql = `CREATE TABLE students(
  id int auto_increment primary key,
  studentId varchar(150) UNIQUE,
  studentName varchar(150),
  programme varchar(150),
  department varchar(150),
  batch varchar(75)
 );`;

  try {
    connection.query(sql, (err, result) => {
      if (err) console.log("could not create students table");
    });
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = createStudentsTable;
