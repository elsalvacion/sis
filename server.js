const express = require("express");

// connect to DB
require("dotenv").config({ path: "./config/.env" });
const { connectDB, connection } = require("./config/db");
connectDB();

// require routes
const admin = require("./routes/admin");
const auth = require("./routes/auth");

const app = express();
app.use(express.json());

// const User = require("./model/User");
// User();
// use routes
app.use("/admin", admin);
app.use("/auth", auth);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => console.log(`App running at ${PORT}`));
