const router = require("express").Router();
const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.query("SELECT * FROM users WHERE username=?", [username], async (err, result) => {

    if (result.length === 0)
      return res.json({ msg: "User not found" });

    const user = result[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) return res.json({ msg: "Wrong password" });

    const token = jwt.sign({ id: user.id, role: user.role }, "secretkey");

    res.json({
      token,
      role: user.role,
      username: user.username
    });
  });
});

module.exports = router;