require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db");

const patientsRoute = require("./routes/patients");
const doctorsRoute = require("./routes/doctors");
const appointmentsRoute = require("./routes/appointments");
const diagnosisRoute = require("./routes/diagnosis");
const treatmentRoute = require("./routes/treatment");
const labReportsRoute = require("./routes/lab_reports");
const remindersRoute = require("./routes/reminders");
const llmsummaryRoute = require("./routes/llmSummary");
const snowflakeRoute = require("./routes/snowflake");
const { analyzeLabReport } = require("./aiAlerts");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/patients", patientsRoute);
app.use("/api/doctors", doctorsRoute);
app.use("/api/appointments", appointmentsRoute);
app.use("/api/diagnosis", diagnosisRoute);
app.use("/api/treatment", treatmentRoute);
app.use("/api/lab-reports", labReportsRoute);
app.use("/api/reminders", remindersRoute);
app.use("/api/llm-summary", llmsummaryRoute);
app.use("/api/snowflake", snowflakeRoute);

app.get("/api/ai-alerts", (req, res) => {
  const sql = "SELECT * FROM lab_reports";

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const analyzed = results.map((report) => ({
      patient_id: report.patient_id,
      patient_name: report.patient_name || `Patient ${report.patient_id}`,
      alerts: analyzeLabReport(report)
    }));

    res.json(analyzed);
  });
});

app.get("/", (req, res) => {
  res.send("EMR backend is running");
});

const PORT = process.env.PORT || 5000;
app.get("/api/ai-pathology/:id", (req, res) => {
  const patientId = req.params.id;

  const patientSql = "SELECT * FROM patients WHERE patient_id = ?";
  const labSql = `
    SELECT *
    FROM lab_reports
    WHERE patient_id = ?
    ORDER BY report_id DESC
    LIMIT 1
  `;

  db.query(patientSql, [patientId], (err, patientResults) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (patientResults.length === 0) {
      return res.status(404).json({ error: "Patient not found" });
    }

    db.query(labSql, [patientId], (err, labResults) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      const patient = patientResults[0];
      const latestLab = labResults.length > 0 ? labResults[0] : null;
      const alerts = latestLab ? analyzeLabReport(latestLab) : [];

      res.json({
        patient,
        latestLab,
        alerts
      });
    });
  });
});

app.get("/api/ai-pathology-trends/:id", (req, res) => {
  const patientId = req.params.id;

  const sql = `
    SELECT report_id, patient_id, test_date, glucose, cholesterol, hemoglobin
    FROM lab_reports
    WHERE patient_id = ?
    ORDER BY test_date ASC, report_id ASC
  `;

  db.query(sql, [patientId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json(results);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});