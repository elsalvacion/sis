const mysql = require("mysql");

const connection = mysql.createConnection({
  host: process.env.DB_HOSTNAME,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const connectDB = () => {
  try {
    connection.connect();
    console.log("connected to sis database");
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = {
  connectDB,
  connection,
};
