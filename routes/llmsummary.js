const express = require("express");
const router = express.Router();
const OpenAI = require("openai");
const db = require("../db");
const { analyzeLabReport } = require("../aiAlerts");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});
console.log("OpenAI key starts with:", process.env.OPENAI_API_KEY?.slice(0, 12));
router.post("/:patientId", (req, res) => {
  const patientId = req.params.patientId;

  const patientSql = "SELECT * FROM patients WHERE patient_id = ?";
  const labSql = `
    SELECT *
    FROM lab_reports
    WHERE patient_id = ?
    ORDER BY report_id DESC
    LIMIT 1
  `;

  db.query(patientSql, [patientId], (err, patientResults) => {
    if (err) return res.status(500).json({ error: err.message });

    if (patientResults.length === 0) {
      return res.status(404).json({ error: "Patient not found" });
    }

    db.query(labSql, [patientId], async (err, labResults) => {
      if (err) return res.status(500).json({ error: err.message });

      const patient = patientResults[0];
      const latestLab = labResults[0];

      if (!latestLab) {
        return res.json({
          summary: "No lab report available for this patient."
        });
      }

      const alerts = analyzeLabReport(latestLab);

      try {
        const response = await client.responses.create({
          model: "gpt-4o-mini",
          input: `
Create a short clinical summary for an EMR system.
Do not diagnose. Use only given data.

Patient:
Name: ${patient.first_name} ${patient.last_name}
Gender: ${patient.gender}

Lab Values:
Glucose: ${latestLab.glucose}
Cholesterol: ${latestLab.cholesterol}
Hemoglobin: ${latestLab.hemoglobin}

Alerts:
${JSON.stringify(alerts)}

Write 3–4 sentences.
          `
        });

        res.json({ summary: response.output_text });

      } catch (error) {
        console.error("LLM error:", error);
        res.status(500).json({ error: error.message });
      }
    });
  });
});

module.exports = router;