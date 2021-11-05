const router = require("express").Router();
const { body, validationResult } = require("express-validator");
const { connection } = require("../config/db");
const { nanoid } = require("nanoid");

// create a course
router.post(
  "/",
  body("teacherName").notEmpty().withMessage("Teacher Name is required"),
  body("qualifications").notEmpty().withMessage("Qualifications is required"),
  body("department").notEmpty().withMessage("Department is required"),
  body("designation").notEmpty().withMessage("Designation is required"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { teacherName, qualifications, department, designation } = req.body;

      const teacherId = nanoid(6);

      const sql = `INSERT INTO teachers (teacherId, teacherName, qualifications, semester, department, designation) VALUES ('${teacherId}','${teacherName}','${qualifications}',${department},'${department}','${designation}');`;

      connection.query(sql, (err, results) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY")
            return res.status(200).json({ msg: "Teacher  already exist" });
          else throw err;
        }
        res.status(200).json({ msg: "Teacher added" });
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

// get courses
router.get("/", (req, res) => {
  try {
    const sql = `SELECT * FROM teachers;`;

    connection.query(sql, (err, results) => {
      if (err)
        return res
          .status(200)
          .json({ msg: "Could not fetch teacher at this moment" });

      res.status(200).json({ msg: results });
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
});

// get a course
router.get("/:id", (req, res) => {
  try {
    const sql = `SELECT * FROM teachers WHERE id=${req.params.id};`;

    connection.query(sql, (err, results) => {
      if (err)
        return res
          .status(200)
          .json({ msg: "Could not fetch teachers at this moment" });

      res.status(200).json({ msg: results });
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
});

// update a student
// router.put(
//   "/:id",
//   (req, res) => {
//     try {
//       const sql = `UPDATE courses SET teacher='${req.body.teacher}' WHERE id=${req.params.id};`;

//       connection.query(sql, (err, results) => {
//         if (err)
//           return res
//             .status(200)
//             .json({ msg: "Could not update course at this moment" });

//         res.status(200).json({ msg: "Course updated" });
//       });
//     } catch (err) {
//       res.status(500).json({
//         errors: [
//           {
//             msg: "Server Error",
//           },
//         ],
//       });
//     }
//   }
// );

// delete a course
router.delete("/:id", (req, res) => {
  try {
    const sql = `DELETE FROM teachers WHERE id=${req.params.id};`;

    connection.query(sql, (err, results) => {
      if (err)
        return res
          .status(200)
          .json({ msg: "Could not delete teacher at this moment" });

      res.status(200).json({ msg: "Teacher deleted" });
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
});
module.exports = router;
