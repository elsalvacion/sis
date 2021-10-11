const router = require("express").Router();
const { body, validationResult } = require("express-validator");
const { connection } = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// login a user
router.post(
  "/login",
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
      const sql = `SELECT * FROM user WHERE email='${email}' AND role='${role}';`;
      connection.query(sql, async (err, results) => {
        if (err)
          return res
            .status(400)
            .json({ errors: [{ msg: "Wrong email or role" }] });

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
