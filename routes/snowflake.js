const express = require("express");
const router = express.Router();
const snowflake = require("snowflake-sdk");

router.get("/insights", (req, res) => {
  const connection = snowflake.createConnection({
    account: process.env.SF_ACCOUNT,
    username: process.env.SF_USER,
    password: process.env.SF_PASSWORD,
    warehouse: process.env.SF_WAREHOUSE,
    database: process.env.SF_DATABASE,
    schema: process.env.SF_SCHEMA
  });

  connection.connect((err) => {
    if (err) {
      console.error("Snowflake connection failed full error:", err);
      return res.status(500).json({ error: err.message });
    }

    const query = `
      SELECT 
        AVG(glucose) AS avg_glucose,
        AVG(cholesterol) AS avg_cholesterol,
        COUNT_IF(glucose > 180) AS high_glucose_patients
      FROM lab_reports
    `;

    connection.execute({
      sqlText: query,
      complete: (err, stmt, rows) => {
        connection.destroy();

        if (err) {
          console.error("Snowflake query failed full error:", err);
          return res.status(500).json({ error: err.message });
        }

        res.json(rows[0]);
      }
    });
  });
});

module.exports = router;