const express = require("express");
const router = express.Router();
const db = require("../db");

// GET all doctors
router.get("/", (req, res) => {
  db.query("SELECT * FROM doctors", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// ADD new doctor
router.post("/", (req, res) => {
  const { first_name, last_name, specialization, phone, email } = req.body;

  const sql = `
    INSERT INTO doctors (first_name, last_name, specialization, phone, email)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [first_name, last_name, specialization, phone, email],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({
        message: "Doctor added successfully",
        doctor_id: result.insertId
      });
    }
  );
});

module.exports = router;