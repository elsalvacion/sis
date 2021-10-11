const { connection } = require("../config/db");

// create user table
const createUserTable = () => {
  const sql = `CREATE TABLE user(
  id int auto_increment primary key,
  email varchar(150) UNIQUE,
  role varchar(150),
  password varchar(150) 
 )`;

  try {
    connection.query(sql, (err, result) => {
      if (err) console.log("could not create user table");
    });
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = createUserTable;
