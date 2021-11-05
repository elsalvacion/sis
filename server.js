const express = require("express");

// connect to DB
require("dotenv").config({ path: "./config/.env" });
const { connectDB, connection } = require("./config/db");
connectDB();

// require routes
const courses = require("./routes/courses");
const auth = require("./routes/auth");
const students = require("./routes/students");

const app = express();
app.use(express.json());

// const Courses = require("./dbTables/Courses");
// Courses();

// const User = require("./dbTables/User");
// User();

// const Teachers = require("./dbTables/Teachers");
// Teachers();

// const Students = require("./dbTables/Students");
// Students();

// use routes
app.use("/courses", courses);
app.use("/auth", auth);
app.use("/students", students);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => console.log(`App running at ${PORT}`));
