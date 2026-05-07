function analyzeLabReport(report) {
  let alerts = [];

  // 🔴 CRITICAL CONDITIONS
  if (report.glucose > 180) {
    alerts.push({ type: "critical", message: "Very high glucose - possible diabetes risk" });
  }

  if (report.cholesterol > 240) {
    alerts.push({ type: "critical", message: "High cholesterol - cardiovascular risk" });
  }

  if (report.wbc > 11000) {
    alerts.push({ type: "warning", message: "Elevated WBC - possible infection" });
  }

  if (report.hemoglobin < 10) {
    alerts.push({ type: "warning", message: "Low hemoglobin - possible anemia" });
  }

  // 🟢 NORMAL CASE
  if (alerts.length === 0) {
    alerts.push({ type: "normal", message: "All lab values within normal range" });
  }

  return alerts;
}

module.exports = { analyzeLabReport };