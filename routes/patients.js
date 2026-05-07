const express = require("express");
const router = express.Router();
const db = require("../db");

// GET all patients
router.get("/", (req, res) => {
  db.query("SELECT * FROM patients", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// ADD new patient
router.post("/", (req, res) => {
  const { first_name, last_name, dob, gender, phone, email, address } = req.body;

  const sql = `
    INSERT INTO patients (first_name, last_name, dob, gender, phone, email, address)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [first_name, last_name, dob, gender, phone, email, address],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({
        message: "Patient added successfully",
        patient_id: result.insertId
      });
    }
  );
});

module.exports = router;