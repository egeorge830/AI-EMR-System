import { useEffect, useState } from "react";
import axios from "axios";

function AddLabReport() {
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({
    patient_id: "",
    glucose: "",
    cholesterol: "",
    hemoglobin: "",
    notes: ""
  });

  // Load patients for dropdown
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/patients")
      .then((res) => setPatients(res.data))
      .catch((err) => console.error("Error loading patients:", err));
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/lab-reports", form);
      alert("Lab report added!");

      setForm({
        patient_id: "",
        glucose: "",
        cholesterol: "",    
        hemoglobin: "",
        notes: ""
      });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to add lab report");
    }
  };

  const inputStyle = {
    padding: "10px",
    marginBottom: "12px",
    width: "100%",
    borderRadius: "6px",
    border: "1px solid #ccc"
  };

  return (
    <div>
      <h2>Add Lab Report</h2>

      <form onSubmit={handleSubmit} style={{ maxWidth: "500px", marginTop: "20px" }}>
        
        {/* Patient Dropdown */}
        <select
          name="patient_id"
          value={form.patient_id}
          onChange={handleChange}
          style={inputStyle}
          required
        >
          <option value="">Select Patient</option>
          {patients.map((p) => (
            <option key={p.patient_id} value={p.patient_id}>
              {p.patient_id} - {p.first_name} {p.last_name}
            </option>
          ))}
        </select>

        <input
          name="glucose"
          type="number"
          placeholder="Glucose"
          value={form.glucose}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          name="cholesterol"
          type="number"
          placeholder="Cholesterol"
          value={form.cholesterol}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          name="hemoglobin"
          type="number"
          step="0.1"
          placeholder="Hemoglobin"
          value={form.hemoglobin}
          onChange={handleChange}
          style={inputStyle}
        />

        <textarea
          name="notes"
          placeholder="Notes"
          value={form.notes}
          onChange={handleChange}
          style={{ ...inputStyle, height: "90px" }}
        />

        <button
          type="submit"
          style={{
            padding: "10px 20px",
            backgroundColor: "#1f3b57",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Add Lab Report
        </button>
      </form>
    </div>
  );
}

export default AddLabReport;