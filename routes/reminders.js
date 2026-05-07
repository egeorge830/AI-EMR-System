const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const db = require("../db");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
router.get("/test", (req, res) => {
  res.send("Reminders route is working");
});
router.post("/send/:appointmentId", (req, res) => {
  const appointmentId = req.params.appointmentId;

  const sql = `
  SELECT *
  FROM appointments
  WHERE appointment_id = ?
`;

  db.query(sql, [appointmentId], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length === 0) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    const appt = results[0];

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: appt.patient_email,
        subject: "Appointment Reminder",
        text: `Hello ${appt.patient_name},

This is a reminder for your appointment.

Doctor: ${appt.doctor_name}
Date: ${appt.appointment_date}
Time: ${appt.appointment_time}

Thank you,
EMR System`
      });

      res.json({ message: "Reminder email sent successfully" });
   } catch (error) {
  console.error("Email send error:", error);
  res.status(500).json({ error: error.message });
}
  });
});

module.exports = router;
console.log("Reminders route loaded");