const express = require("express");
const router = express.Router();
const db = require("../db");

// GET all treatment records
router.get("/", (req, res) => {
  db.query("SELECT * FROM treatment", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// ADD new treatment
router.post("/", (req, res) => {
  const {
    patient_id,
    treatment_date,
    therapy_plan,
    procedures,
    diet_plan,
    lifestyle_changes,
    follow_up_date,
    notes
  } = req.body;

  const sql = `
    INSERT INTO treatment
    (patient_id, treatment_date, therapy_plan, procedures, diet_plan, lifestyle_changes, follow_up_date, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      patient_id,
      treatment_date,
      therapy_plan,
      procedures,
      diet_plan,
      lifestyle_changes,
      follow_up_date,
      notes
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({
        message: "Treatment added successfully",
        treatment_id: result.insertId
      });
    }
  );
});

module.exports = router;