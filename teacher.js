const router = require("express").Router();
const db = require("../db");

/* ===========================
   GET STUDENTS BY SUBJECT
=========================== */
router.get("/students/:subjectId", (req, res) => {
  const subjectId = req.params.subjectId;

  db.query(
    `
    SELECT st.id, st.name 
    FROM students st
    JOIN subjects sub ON st.section = sub.section
    WHERE sub.id = ?
    `,
    [subjectId],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ msg: "DB Error" });
      }
      res.json(result);
    }
  );
});


/* ===========================
   VERIFY TOKEN (TODAY ONLY)
=========================== */
router.post("/verify-token", (req, res) => {
  const { token } = req.body;

  db.query(
    `
    SELECT * FROM tokens 
    WHERE token=? AND DATE(date) = CURDATE()
    `,
    [token],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ msg: "DB Error" });
      }

      if (result.length > 0) {
        res.json({
          valid: true,
          subject_id: result[0].subject_id
        });
      } else {
        res.json({ valid: false });
      }
    }
  );
});


/* ===========================
   MARK ATTENDANCE
=========================== */
router.post("/mark-attendance", (req, res) => {
  const { student_id, subject_id, status } = req.body;

  if (!student_id || !subject_id || !status) {
    return res.status(400).json({ msg: "Missing fields" });
  }

  db.query(
    `
    INSERT INTO attendance(student_id, subject_id, date, status, marked_by)
    VALUES (?, ?, CURDATE(), ?, ?)
    `,
    [student_id, subject_id, status, 1], // temp teacher_id
    (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ msg: "Insert Failed" });
      }

      res.json({ msg: "Attendance Marked ✅" });
    }
  );
});

module.exports = router;