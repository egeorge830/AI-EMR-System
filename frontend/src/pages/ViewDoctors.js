import { useEffect, useState } from "react";
import axios from "axios";

function ViewDoctors() {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/doctors")
      .then((res) => setDoctors(res.data))
      .catch((err) => console.error("Error fetching doctors:", err));
  }, []);

  return (
    <div>
      <h2>Doctors List</h2>

      <div style={{ overflowX: "auto", marginTop: "20px" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            backgroundColor: "#fff"
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#1f3b57", color: "white" }}>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>ID</th>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>First Name</th>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>Last Name</th>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>Specialization</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((d) => (
              <tr key={d.doctor_id}>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{d.doctor_id}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{d.first_name}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{d.last_name}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{d.specialization}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ViewDoctors;