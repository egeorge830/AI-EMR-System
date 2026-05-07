import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [counts, setCounts] = useState({
    patients: 0,
    doctors: 0,
    appointments: 0
  });

  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState("all");

  const [insights, setInsights] = useState(null);
  const [insightsError, setInsightsError] = useState("");

  // 📊 FETCH COUNTS
  useEffect(() => {
    const fetchData = async () => {
      try {
        const patients = await axios.get("http://localhost:5000/api/patients");
        const doctors = await axios.get("http://localhost:5000/api/doctors");
        const appointments = await axios.get("http://localhost:5000/api/appointments");

        setCounts({
          patients: patients.data.length,
          doctors: doctors.data.length,
          appointments: appointments.data.length
        });
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  // 🤖 FETCH AI ALERTS
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/ai-alerts")
      .then((res) => setAlerts(res.data))
      .catch((err) => console.log(err));
  }, []);

  // ❄️ FETCH SNOWFLAKE INSIGHTS
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/snowflake/insights")
      .then((res) => setInsights(res.data))
      .catch((err) => {
        console.error(err);
        setInsightsError("Failed to load insights");
      });
  }, []);

  // 🎯 FILTER FUNCTION
  const getFilteredAlerts = (type) => {
    return alerts
      .map((patient) => {
        let filtered = patient.alerts.filter((a) => a.type === type);

        if (filter !== "all") {
          filtered = filtered.filter((a) => a.type === filter);
        }

        return { ...patient, alerts: filtered };
      })
      .filter((p) => p.alerts.length > 0);
  };

  return (
    <div>
      <h2 style={{ color: "#2c3e50" }}>Dashboard</h2>

      {/* 📊 CARDS */}
      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        <div style={{
          padding: "20px",
          border: "1px solid #2ecc71",
          borderRadius: "8px",
          width: "200px",
          textAlign: "center",
          backgroundColor: "#eafaf1"
        }}>
          <h3>Total Patients</h3>
          <p style={{ fontSize: "24px", fontWeight: "bold" }}>{counts.patients}</p>
        </div>

        <div style={{
          padding: "20px",
          border: "1px solid #3498db",
          borderRadius: "8px",
          width: "200px",
          textAlign: "center",
          backgroundColor: "#ebf5fb"
        }}>
          <h3>Total Doctors</h3>
          <p style={{ fontSize: "24px", fontWeight: "bold" }}>{counts.doctors}</p>
        </div>

        <div style={{
          padding: "20px",
          border: "1px solid #f39c12",
          borderRadius: "8px",
          width: "200px",
          textAlign: "center",
          backgroundColor: "#fef5e7"
        }}>
          <h3>Total Appointments</h3>
          <p style={{ fontSize: "24px", fontWeight: "bold" }}>{counts.appointments}</p>
        </div>
      </div>

      {/* 🤖 AI ALERTS */}
      <h2 style={{ marginTop: "40px", color: "#2c3e50" }}>AI Alerts</h2>

      {/* FILTER */}
      <div style={{ marginTop: "10px", marginBottom: "20px" }}>
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("critical")}> 🔴 Critical</button>
        <button onClick={() => setFilter("warning")}> 🟡 Warning</button>
        <button onClick={() => setFilter("normal")}> 🟢 Normal</button>
      </div>

      {/* CRITICAL */}
      <h3 style={{ color: "#c0392b" }}>🚨 Urgent Attention Required</h3>
      {getFilteredAlerts("critical").map((patient, index) => (
        <div key={index} style={{ marginBottom: "15px", padding: "15px", backgroundColor: "#fdecea" }}>
          <strong>{patient.patient_name}</strong>
          {patient.alerts.map((alert, i) => (
            <div key={i} style={{ marginTop: "8px", padding: "10px", backgroundColor: "#e74c3c", color: "white" }}>
              {alert.message}
            </div>
          ))}
        </div>
      ))}

      {/* WARNING */}
      <h3 style={{ marginTop: "30px", color: "#b9770e" }}>🟡 Monitor Closely</h3>
      {getFilteredAlerts("warning").map((patient, index) => (
        <div key={index} style={{ marginBottom: "15px", padding: "15px", backgroundColor: "#fef5e7" }}>
          <strong>{patient.patient_name}</strong>
          {patient.alerts.map((alert, i) => (
            <div key={i} style={{ marginTop: "8px", padding: "10px", backgroundColor: "#f39c12", color: "white" }}>
              {alert.message}
            </div>
          ))}
        </div>
      ))}

      {/* NORMAL */}
      <h3 style={{ marginTop: "30px", color: "#1e8449" }}>🟢 Within Normal Limits</h3>
      {getFilteredAlerts("normal").map((patient, index) => (
        <div key={index} style={{ marginBottom: "15px", padding: "15px", backgroundColor: "#eafaf1" }}>
          <strong>{patient.patient_name}</strong>
          {patient.alerts.map((alert, i) => (
            <div key={i} style={{ marginTop: "8px", padding: "10px", backgroundColor: "#2ecc71", color: "white" }}>
              {alert.message}
            </div>
          ))}
        </div>
      ))}

      {/* ❄️ SNOWFLAKE INSIGHTS */}
      <div style={{
        marginTop: "40px",
        padding: "20px",
        backgroundColor: "#ffffff",
        borderRadius: "10px"
      }}>
        <h3>📊 Population Insights (Snowflake)</h3>

        {insightsError && <p style={{ color: "red" }}>{insightsError}</p>}

        {insights ? (
          <div style={{ display: "flex", gap: "20px" }}>
            <div>
              <strong>Avg Glucose</strong>
              <p>{Number(insights.AVG_GLUCOSE).toFixed(2)}</p>
            </div>

            <div>
              <strong>Avg Cholesterol</strong>
              <p>{Number(insights.AVG_CHOLESTEROL).toFixed(2)}</p>
            </div>

            <div>
              <strong>High Glucose Patients</strong>
              <p>{insights.HIGH_GLUCOSE_PATIENTS}</p>
            </div>
          </div>
        ) : (A
          <p>Loading insights...</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;