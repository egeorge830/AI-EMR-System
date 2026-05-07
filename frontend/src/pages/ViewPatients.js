import { useEffect, useState } from "react";
import axios from "axios";

function ViewPatients() {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/patients")
      .then((res) => setPatients(res.data))
      .catch((err) => console.error("Error fetching patients:", err));
  }, []);

  return (
    <div>
      <h2>Patients List</h2>

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
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>Gender</th>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>Phone</th>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>Email</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p) => (
              <tr key={p.patient_id}>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{p.patient_id}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{p.first_name}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{p.last_name}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{p.gender}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{p.phone}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{p.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ViewPatients;