import { useEffect, useState } from "react";
import axios from "axios";

function ViewAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/appointments")
      .then((res) => setAppointments(res.data))
      .catch((err) => {
        console.error(err);
        setError("Failed to load appointments");
      });
  }, []);

  const sendReminder = async (appointmentId) => {
    try {
      const res = await axios({
        method: "post",
        url: `http://localhost:5000/api/reminders/send/${appointmentId}`,
        headers: {
          "Content-Type": "application/json"
        }
      });

      setMessage(res.data.message || "Reminder sent!");
      setError("");
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError("Error: " + (err.response?.data?.error || "Failed to send"));
      setMessage("");
    }
  };

  return (
    <div>
      <h2>Appointments</h2>

      {message && <p style={{ color: "green", fontWeight: "bold" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ overflowX: "auto", marginTop: "20px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "#fff" }}>
          <thead>
            <tr style={{ backgroundColor: "#1f3b57", color: "white" }}>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>Patient</th>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>Doctor</th>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>Date</th>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>Time</th>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>Reminder</th>
            </tr>
          </thead>

          <tbody>
            {appointments.map((a) => (
              <tr key={a.appointment_id}>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{a.patient_name}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{a.doctor_name}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {a.appointment_date ? String(a.appointment_date).slice(0, 10) : "N/A"}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {a.appointment_time ? String(a.appointment_time) : "N/A"}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  <button
                    onClick={() => sendReminder(a.appointment_id)}
                    style={{
                      padding: "8px 12px",
                      backgroundColor: "#3498db",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer"
                    }}
                  >
                    Send Reminder
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ViewAppointments;