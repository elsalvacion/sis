const router = require("express").Router();
const { body, validationResult } = require("express-validator");
const { connection } = require("../config/db");
const { nanoid } = require("nanoid");
// create a course
router.post(
  "/",
  body("studentName").notEmpty().withMessage("Student Name is required"),
  body("programme").notEmpty().withMessage("Programme is required"),
  body("department").notEmpty().withMessage("Department is required"),
  body("batch").notEmpty().withMessage("Batch is required"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { studentName, programme, department, batch } = req.body;

      const studentId = nanoid(6);
      const sql = `INSERT INTO students (studentId, studentName, programme,  department, batch) VALUES ('${studentId}','${studentName}','${programme}','${department}','${batch}');`;

      connection.query(sql, (err, results) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY")
            return res.status(200).json({ msg: "Student  already exist" });
          else throw err;
        }
        res.status(200).json({ msg: "Student added" });
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
    const sql = `SELECT * FROM students;`;

    connection.query(sql, (err, results) => {
      if (err)
        return res
          .status(200)
          .json({ msg: "Could not fetch students at this moment" });

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
    const sql = `SELECT * FROM students WHERE id=${req.params.id};`;

    connection.query(sql, (err, results) => {
      if (err)
        return res
          .status(200)
          .json({ msg: "Could not fetch students at this moment" });

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
    const sql = `DELETE FROM students WHERE id=${req.params.id};`;

    connection.query(sql, (err, results) => {
      if (err)
        return res
          .status(200)
          .json({ msg: "Could not delete student at this moment" });

      res.status(200).json({ msg: "Student deleted" });
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
