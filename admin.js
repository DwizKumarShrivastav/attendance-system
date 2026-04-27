const router = require("express").Router();
const db = require("../db");
const bcrypt = require("bcrypt");

/* ================= ADD STUDENT ================= */
router.post("/add-student", async (req, res) => {
  const { username, password, name, erp, section } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO users(username,password,role) VALUES(?,?,?)",
      [username, hash, "student"],
      (err, result) => {
        if (err) return res.json({ msg: "User Error" });

        const userId = result.insertId;

        db.query(
          "INSERT INTO students(user_id,name,erp,section) VALUES(?,?,?,?)",
          [userId, name, erp, section],
          (err2) => {
            if (err2) return res.json({ msg: "Student Error" });

            res.json({ msg: "Student Added ✅" });
          }
        );
      }
    );
  } catch {
    res.json({ msg: "Server Error" });
  }
});

/* ================= ADD TEACHER ================= */
router.post("/add-teacher", async (req, res) => {
  const { username, password, name, department } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO users(username,password,role) VALUES(?,?,?)",
      [username, hash, "teacher"],
      (err, result) => {
        if (err) return res.json({ msg: "User Error" });

        const userId = result.insertId;

        db.query(
          "INSERT INTO teachers(user_id,name,department) VALUES(?,?,?)",
          [userId, name, department],
          (err2) => {
            if (err2) return res.json({ msg: "Teacher Error" });

            res.json({ msg: "Teacher Added ✅" });
          }
        );
      }
    );
  } catch {
    res.json({ msg: "Server Error" });
  }
});

/* ================= ADD SUBJECT ================= */
router.post('/add-subject', (req, res) => {
  const { subject_name, section } = req.body;

  db.query(
    'INSERT INTO subjects(subject_name, section) VALUES(?,?)',
    [subject_name, section],
    (err, result) => {
      if (err) return res.json({ msg: "Error adding subject" });

      res.json({
        msg: "Subject Added",
        subject_id: result.insertId   // ✅ IMPORTANT
      });
    }
  );
});

/* ================= GENERATE TOKEN ================= */
router.post('/generate-token', (req, res) => {
  const { subject_id } = req.body;

  if (!subject_id) {
    return res.json({ msg: "Subject ID required" });
  }

  const token = Math.random().toString(36).substring(2,8);

  db.query(
    'INSERT INTO tokens(token,subject_id,date) VALUES(?,?,CURDATE())',
    [token, subject_id],
    (err) => {
      if (err) return res.json({ msg: "DB Error" });

      res.json({ token });
    }
  );
});

module.exports = router;