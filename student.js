const router = require("express").Router();
const db = require("../db");

router.get("/attendance/:username", (req, res) => {

  db.query(
    `
    SELECT a.date, a.status, s.subject_name
    FROM attendance a
    JOIN subjects s ON a.subject_id = s.id
    JOIN students st ON a.student_id = st.id
    JOIN users u ON st.user_id = u.id
    WHERE u.username = ?
    `,
    [req.params.username],
    (err, result) => {
      if (err) return res.status(500).json({ msg: "DB Error" });
      res.json(result);
    }
  );
});

module.exports = router;