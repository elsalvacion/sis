const { connection } = require("../config/db");

// create user table
const createTeachersTable = () => {
  const sql = `CREATE TABLE teachers(
  id int auto_increment primary key,
  teacherId varchar(150) UNIQUE,
  teacherName varchar(150),
  department varchar(150),
  qualifications varchar(75),
  designation varchar(75)
 );`;

  try {
    connection.query(sql, (err, result) => {
      if (err) {
        console.log("could not create teachers table");
        console.log(err);
      }
    });
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = createTeachersTable;
