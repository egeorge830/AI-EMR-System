const express = require("express");
const router = express.Router();
const db = require("../db");

// GET all diagnosis records
router.get("/", (req, res) => {
  db.query("SELECT * FROM diagnosis", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// ADD new diagnosis
router.post("/", (req, res) => {
  const {
    patient_id,
    doctor_id,
    diagnosis_date,
    symptoms,
    final_diagnosis,
    notes
  } = req.body;

  const sql = `
    INSERT INTO diagnosis
    (patient_id, doctor_id, diagnosis_date, symptoms, final_diagnosis, notes)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [patient_id, doctor_id, diagnosis_date, symptoms, final_diagnosis, notes],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({
        message: "Diagnosis added successfully",
        diagnosis_id: result.insertId
      });
    }
  );
});

module.exports = router;