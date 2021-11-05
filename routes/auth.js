const router = require("express").Router();
const { body, validationResult } = require("express-validator");
const { connection } = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// create a user
router.post(
  "/register",
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Incorrect email"),
  body("role").notEmpty().withMessage("Role is required"),
  body("password").notEmpty().withMessage("Password is required"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, role, password } = req.body;

    try {
      const salt = await bcrypt.genSalt(10);

      const encPasss = await bcrypt.hash(password, salt);

      const sql = `INSERT INTO user(email, role, password) values ('${email}', '${role}', '${encPasss}');`;

      connection.query(sql, (err, results) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY")
            return res.status(200).json({ msg: "User already exist" });
          else throw err;
        }
        res.status(200).json({ msg: "User added" });
      });
    } catch (err) {
      res.status(500).json({
        errors: [
          {
            msg: "Server Error",
          },
        ],
      });
    }
  }
);

// login a user
router.post(
  "/login",
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Incorrect email"),
  body("password").notEmpty().withMessage("Password is required"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;

    try {
      const sql = `SELECT * FROM user WHERE email='${email}';`;
      connection.query(sql, async (err, results) => {
        if (err)
          return res.status(400).json({ errors: [{ msg: "Wrong email" }] });

        const isMatch = await bcrypt.compare(password, results[0].password);

        if (!isMatch)
          return res.status(400).json({ errors: [{ msg: "Wrong password" }] });

        const token = jwt.sign(
          { user: { id: results[0].id, role: results[0].role } },
          process.env.JWT_SECRET,
          {
            expiresIn: "30 days",
          }
        );

        res.status(200).json({ msg: token });
      });
    } catch (err) {
      res.status(500).json({
        errors: [
          {
            msg: "Server Error",
          },
        ],
      });
    }
  }
);

module.exports = router;
