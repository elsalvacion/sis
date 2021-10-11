const router = require("express").Router();
const { body, validationResult } = require("express-validator");
const { connection } = require("../config/db");
const bcrypt = require("bcryptjs");

// create a user
router.post(
  "/create/user",
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
        if (err) throw err;
      });
      res.status(200).json({ msg: "User added" });
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
