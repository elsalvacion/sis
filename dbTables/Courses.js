const { connection } = require("../config/db");

// create user table
const createCoursesTable = () => {
  const sql = `CREATE TABLE courses(
  id int auto_increment primary key,
  courseCode varchar(150) UNIQUE,
  courseName varchar(150),
  programme varchar(150),
  semester int,
  teacher varchar(150),
  academicYear varchar(75)
 );`;

  try {
    connection.query(sql, (err, result) => {
      if (err) console.log("could not create courses table");
    });
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = createCoursesTable;
