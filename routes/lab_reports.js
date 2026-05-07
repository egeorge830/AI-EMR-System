const express = require("express");
const router = express.Router();
const db = require("../db");

// GET all lab reports
router.get("/", (req, res) => {
  db.query("SELECT * FROM lab_reports", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// ADD new lab report
router.post("/", (req, res) => {
  const { patient_id, glucose, cholesterol, hemoglobin } = req.body;

  const getPatientSql =
    "SELECT first_name, last_name FROM patients WHERE patient_id = ?";

  db.query(getPatientSql, [patient_id], (err, patientResult) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (patientResult.length === 0) {
      return res.status(404).json({ error: "Patient not found" });
    }

    const patient_name = `${patientResult[0].first_name} ${patientResult[0].last_name}`;

    const sql = `
      INSERT INTO lab_reports
      (patient_id, patient_name, test_date, glucose, cholesterol, hemoglobin)
      VALUES (?, ?, CURDATE(), ?, ?, ?)
    `;

    db.query(
      sql,
      [patient_id, patient_name, glucose, cholesterol, hemoglobin],
      (err, result) => {
        if (err) {
          console.error("Lab report insert error:", err);
          return res.status(500).json({ error: err.message });
        }

        res.json({
          message: "Lab report added successfully",
          report_id: result.insertId
        });
      }
    );
  });
});

module.exports = router;