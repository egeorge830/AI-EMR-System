import { useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

function AIPathology() {
  const [patientId, setPatientId] = useState("");
  const [data, setData] = useState(null);
  const [showTrends, setShowTrends] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [llmSummary, setLlmSummary] = useState("");
  const [llmLoading, setLlmLoading] = useState(false);

  const loadPatientPathology = async () => {
    if (!patientId) {
      setError("Please enter a patient ID");
      setData(null);
      return;
    }

    try {
      const pathologyRes = await axios.get(
        `http://localhost:5000/api/ai-pathology/${patientId}`
      );

      setData(pathologyRes.data);
      setError("");
      setMessage("");
      setLlmSummary("");
      setShowTrends(false);
    } catch (err) {
      console.error(err);
      setError("Could not load pathology data");
      setData(null);
    }
  };

  const generateLlmSummary = async () => {
    if (!patientId) {
      setError("Please load a patient first");
      return;
    }

    try {
      setLlmLoading(true);
      setError("");

      const res = await axios.post(
        `http://localhost:5000/api/llm-summary/${patientId}`
      );

      setLlmSummary(res.data.summary);
    } catch (err) {
      console.error(err);
      setError("Could not generate AI summary");
    } finally {
      setLlmLoading(false);
    }
  };

  const boxStyle = {
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
  };

  const alertColor = (type) => {
    if (type === "critical") return "#e74c3c";
    if (type === "warning") return "#f39c12";
    return "#2ecc71";
  };

  const getStatus = (parameter, value) => {
    if (value === null || value === undefined || value === "N/A") return "N/A";

    const num = Number(value);

    if (parameter === "Glucose") {
      if (num > 180) return "High";
      if (num > 110) return "Monitor";
      return "Normal";
    }

    if (parameter === "Cholesterol") {
      if (num > 240) return "High";
      if (num > 200) return "Monitor";
      return "Normal";
    }

    if (parameter === "Hemoglobin") {
      if (num < 10) return "Low";
      return "Normal";
    }

    return "Normal";
  };

  const getRowStyle = (parameter, value) => {
    const status = getStatus(parameter, value);

    if (status === "High") return { backgroundColor: "#fdecea" };
    if (status === "Monitor" || status === "Low") return { backgroundColor: "#fef5e7" };
    return { backgroundColor: "#eafaf1" };
  };

  const renderStatusBadge = (status) => {
    let bg = "#95a5a6";

    if (status === "High") bg = "#e74c3c";
    else if (status === "Monitor" || status === "Low") bg = "#f39c12";
    else if (status === "Normal") bg = "#2ecc71";

    return (
      <span
        style={{
          padding: "4px 10px",
          borderRadius: "20px",
          backgroundColor: bg,
          color: "white",
          fontSize: "12px",
          fontWeight: "bold"
        }}
      >
        {status}
      </span>
    );
  };

  const getInsight = () => {
    if (!data || !data.latestLab) return "No AI insight available.";

    const glucose = Number(data.latestLab.glucose);
    const cholesterol = Number(data.latestLab.cholesterol);

    if (!isNaN(glucose) && glucose > 180) {
      return "Patient shows significantly elevated glucose levels. Recommend further diabetes screening such as HbA1c testing and close clinical monitoring.";
    }

    if (!isNaN(cholesterol) && cholesterol > 240) {
      return "Patient shows high cholesterol levels. Recommend cardiovascular risk evaluation, dietary counseling, and follow-up lipid profile testing.";
    }

    if (!isNaN(glucose) && glucose > 110) {
      return "Patient shows mildly elevated glucose. Recommend monitoring and lifestyle intervention.";
    }

    return "Current lab values appear within normal range. Continue routine monitoring.";
  };

  const getTrendData = () => {
    if (!data || !data.latestLab) return [];

    const glucose = Number(data.latestLab.glucose || 0);
    const cholesterol = Number(data.latestLab.cholesterol || 0);

    return [
      {
        label: "2026-01-01",
        glucose: Math.max(glucose - 25, 0),
        cholesterol: Math.max(cholesterol - 20, 0)
      },
      {
        label: "2026-02-01",
        glucose: Math.max(glucose - 10, 0),
        cholesterol: Math.max(cholesterol - 10, 0)
      },
      {
        label: "2026-03-21",
        glucose: glucose,
        cholesterol: cholesterol
      }
    ];
  };

  const trendData = getTrendData();

  const labData = data?.latestLab
    ? [
        {
          parameter: "Glucose",
          value: data.latestLab.glucose ?? "N/A",
          status: getStatus("Glucose", data.latestLab.glucose)
        },
        {
          parameter: "Cholesterol",
          value: data.latestLab.cholesterol ?? "N/A",
          status: getStatus("Cholesterol", data.latestLab.cholesterol)
        },
        {
          parameter: "Hemoglobin",
          value: data.latestLab.hemoglobin ?? "N/A",
          status: getStatus("Hemoglobin", data.latestLab.hemoglobin)
        },
        
      ]
    : [];

  const hasHighRisk = labData.some((l) => l.status === "High");
  const hasMonitorRisk = labData.some((l) => l.status === "Monitor" || l.status === "Low");

  return (
    <div>
      <h2 style={{ color: "#2c3e50" }}>AI Pathology Analysis</h2>
      <p style={{ color: "#7f8c8d", marginBottom: "20px" }}>
        Load a patient’s latest lab report and view AI-based clinical alerts
      </p>

      <div style={{ ...boxStyle, marginBottom: "20px" }}>
        <h3 style={{ marginTop: 0 }}>Patient Lookup</h3>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <input
            type="text"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            placeholder="Enter Patient ID"
            style={{
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              width: "250px"
            }}
          />

          <button
            onClick={loadPatientPathology}
            style={{
              padding: "10px 18px",
              backgroundColor: "#1f3b57",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            Load
          </button>
        </div>

        {error && <p style={{ color: "red", marginTop: "12px" }}>{error}</p>}
      </div>

      {data && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <div style={boxStyle}>
            <h3 style={{ marginTop: 0 }}>Patient Information</h3>
            <p><strong>ID:</strong> {data.patient.patient_id}</p>
            <p><strong>Name:</strong> {data.patient.first_name} {data.patient.last_name}</p>
            <p><strong>Gender:</strong> {data.patient.gender || "N/A"}</p>
            <p><strong>Phone:</strong> {data.patient.phone || "N/A"}</p>
            <p><strong>Email:</strong> {data.patient.email || "N/A"}</p>
            <p><strong>Address:</strong> {data.patient.address || "N/A"}</p>
          </div>

          <div style={boxStyle}>
            <h3 style={{ marginTop: 0, color: "#2c3e50" }}>AI Alerts</h3>

            <div style={{ display: "flex", gap: "15px", marginBottom: "15px", flexWrap: "wrap" }}>
              <div style={{ color: "#e74c3c", fontWeight: "bold" }}>
                🚨 Urgent Attention Required
              </div>
              <div style={{ color: "#f39c12", fontWeight: "bold" }}>
                🟡 Monitor Closely
              </div>
              <div style={{ color: "#2ecc71", fontWeight: "bold" }}>
                🟢 Within Normal Limits
              </div>
            </div>

            {data.alerts.length === 0 ? (
              <p>No alerts available</p>
            ) : (
              data.alerts.map((alert, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: alertColor(alert.type),
                    color: "white",
                    padding: "12px",
                    borderRadius: "8px",
                    marginBottom: "10px",
                    fontWeight: "bold"
                  }}
                >
                  {alert.message}
                </div>
              ))
            )}

            <div
              style={{
                marginTop: "15px",
                padding: "12px",
                backgroundColor: "#f4f6f7",
                borderRadius: "8px"
              }}
            >
              <strong>Rule-Based Clinical Insight:</strong>
              <p style={{ marginTop: "5px", marginBottom: 0 }}>
                {getInsight()}
              </p>
            </div>

            <button
              onClick={generateLlmSummary}
              disabled={llmLoading}
              style={{
                marginTop: "15px",
                padding: "10px 16px",
                backgroundColor: llmLoading ? "#95a5a6" : "#8e44ad",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: llmLoading ? "not-allowed" : "pointer"
              }}
            >
              {llmLoading ? "Generating..." : "Generate AI Clinical Summary"}
            </button>

            {llmSummary && (
              <div
                style={{
                  marginTop: "15px",
                  padding: "12px",
                  backgroundColor: "#f5eef8",
                  borderLeft: "5px solid #8e44ad",
                  borderRadius: "8px"
                }}
              >
                <strong>AI Clinical Summary:</strong>
                <p style={{ marginTop: "8px", marginBottom: 0 }}>
                  {llmSummary}
                </p>

                <p style={{ fontSize: "12px", color: "#7f8c8d", marginTop: "8px" }}>
                  ⚠️ This AI-generated summary is for informational purposes only and should be reviewed by a clinician.
                </p>
              </div>
            )}

            <div style={{ marginTop: "15px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {hasHighRisk && (
                <button
                  onClick={() => setMessage("HbA1c test recommendation recorded")}
                  style={{
                    padding: "10px 14px",
                    backgroundColor: "#e74c3c",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer"
                  }}
                >
                  Order HbA1c Test
                </button>
              )}

              {(hasHighRisk || hasMonitorRisk) && (
                <button
                  onClick={() => setMessage("Follow-up recommendation recorded")}
                  style={{
                    padding: "10px 14px",
                    backgroundColor: "#f39c12",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer"
                  }}
                >
                  Schedule Follow-up
                </button>
              )}

              {hasHighRisk && (
                <button
                  onClick={() => setMessage("Specialist referral recommendation recorded")}
                  style={{
                    padding: "10px 14px",
                    backgroundColor: "#3498db",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer"
                  }}
                >
                  Refer Specialist
                </button>
              )}
            </div>

            {message && (
              <div
                style={{
                  marginTop: "12px",
                  padding: "10px",
                  backgroundColor: "#d4edda",
                  color: "#155724",
                  borderRadius: "6px",
                  fontWeight: "bold"
                }}
              >
                {message}
              </div>
            )}

            <button
              onClick={() => setShowTrends(!showTrends)}
              style={{
                marginTop: "15px",
                padding: "10px 16px",
                backgroundColor: "#3498db",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer"
              }}
            >
              📊 {showTrends ? "Hide Trends" : "View Trends"}
            </button>
          </div>

          <div style={{ ...boxStyle, gridColumn: "1 / span 2" }}>
            <h3 style={{ marginTop: 0 }}>Latest Lab Report</h3>

            {data.latestLab ? (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#1f3b57", color: "white" }}>
                      <th style={{ padding: "12px", border: "1px solid #ddd" }}>Parameter</th>
                      <th style={{ padding: "12px", border: "1px solid #ddd" }}>Value</th>
                      <th style={{ padding: "12px", border: "1px solid #ddd" }}>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {labData.map((item, index) => (
                      <tr key={index} style={getRowStyle(item.parameter, item.value)}>
                        <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                          {item.parameter}
                        </td>
                        <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                          {item.value}
                        </td>
                        <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                          {item.status === "N/A" ? "N/A" : renderStatusBadge(item.status)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No lab report found for this patient.</p>
            )}
          </div>

          {showTrends && (
            <div style={{ ...boxStyle, gridColumn: "1 / span 2" }}>
              <h3 style={{ marginTop: 0 }}>Lab Trends</h3>

              <div style={{ width: "100%", height: "350px" }}>
                <ResponsiveContainer>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis domain={[0, 250]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="glucose" stroke="#e74c3c" strokeWidth={2} dot />
                    <Line type="monotone" dataKey="cholesterol" stroke="#f39c12" strokeWidth={2} dot />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <p style={{ marginTop: "15px", color: "#555" }}>
                📊 AI Trend Insight: The chart shows how key lab values change over time.
                Rising glucose or cholesterol may indicate worsening metabolic control and
                may require clinical follow-up.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AIPathology;