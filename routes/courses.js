const router = require("express").Router();
const { body, validationResult } = require("express-validator");
const { connection } = require("../config/db");

// create a course
router.post(
  "/",
  body("courseCode").notEmpty().withMessage("Course Code is required"),
  body("courseName").notEmpty().withMessage("Course Name is required"),
  body("programme").notEmpty().withMessage("Programme is required"),
  body("semester").notEmpty().withMessage("Semester is required"),
  body("academicYear").notEmpty().withMessage("Academic year is required"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const teacher = req.body.teacher || "";
      const { courseCode, courseName, programme, semester, academicYear } =
        req.body;

      const sql = `INSERT INTO courses (courseCode, courseName, programme, semester, teacher, academicYear) VALUES ('${courseCode}','${courseName}','${programme}',${semester},'${teacher}','${academicYear}');`;

      connection.query(sql, (err, results) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY")
            return res.status(200).json({ msg: "Course already exist" });
          else throw err;
        }
        res.status(200).json({ msg: "Course added" });
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
    const sql = `SELECT * FROM courses;`;

    connection.query(sql, (err, results) => {
      if (err)
        return res
          .status(200)
          .json({ msg: "Could not fetch courses at this moment" });

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
    const sql = `SELECT * FROM courses WHERE id=${req.params.id};`;

    connection.query(sql, (err, results) => {
      if (err)
        return res
          .status(200)
          .json({ msg: "Could not fetch course at this moment" });

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

// update a course
router.put(
  "/:id",
  body("teacher").notEmpty().withMessage("Teacher name is required"),
  (req, res) => {
    try {
      const sql = `UPDATE courses SET teacher='${req.body.teacher}' WHERE id=${req.params.id};`;

      connection.query(sql, (err, results) => {
        if (err)
          return res
            .status(200)
            .json({ msg: "Could not update course at this moment" });

        res.status(200).json({ msg: "Course updated" });
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

// delete a course
router.delete("/:id", (req, res) => {
  try {
    const sql = `DELETE FROM courses WHERE id=${req.params.id};`;

    connection.query(sql, (err, results) => {
      if (err)
        return res
          .status(200)
          .json({ msg: "Could not delete course at this moment" });

      res.status(200).json({ msg: "Course deleted" });
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
