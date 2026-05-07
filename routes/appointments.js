const express = require("express");
const router = express.Router();
const db = require("../db");

// GET all appointments
router.get("/", (req, res) => {
  const sql = "SELECT * FROM appointments";

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// ADD new appointment
router.post("/", (req, res) => {
  const {
    patient_name,
    patient_email,
    doctor_name,
    appointment_date,
    appointment_time,
    patient_id
  } = req.body;

  const sql = `
    INSERT INTO appointments
    (patient_name, patient_email, doctor_name, appointment_date, appointment_time, patient_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      patient_name,
      patient_email,
      doctor_name,
      appointment_date,
      appointment_time,
      patient_id
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({
        message: "Appointment added successfully",
        appointment_id: result.insertId
      });
    }
  );
});

module.exports = router;