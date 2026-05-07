import { useEffect, useState } from "react";
import axios from "axios";

function AddAppointment() {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    patient_name: "",
    patient_email: "",
    doctor_name: "",
    appointment_date: "",
    appointment_time: "",
    patient_id: ""
  });

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/patients")
      .then((res) => setPatients(res.data))
      .catch((err) => {
        console.error("Patients load error:", err);
        setError("Failed to load patients");
      });

    axios
      .get("http://localhost:5000/api/doctors")
      .then((res) => setDoctors(res.data))
      .catch((err) => {
        console.error("Doctors load error:", err);
        setError("Failed to load doctors");
      });
  }, []);

  const handlePatientChange = (e) => {
    const selected = patients.find(
      (p) => String(p.patient_id) === String(e.target.value)
    );

    if (!selected) return;

    setForm((prev) => ({
      ...prev,
      patient_id: selected.patient_id,
      patient_name: `${selected.first_name} ${selected.last_name}`,
      patient_email: selected.email || ""
    }));
  };

  const handleDoctorChange = (e) => {
    const selected = doctors.find(
      (d) => String(d.doctor_id) === String(e.target.value)
    );

    if (!selected) return;

    setForm((prev) => ({
      ...prev,
      doctor_name: `${selected.first_name} ${selected.last_name}`
    }));
  };

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/appointments", form);
      alert("Appointment added!");

      setForm({
        patient_name: "",
        patient_email: "",
        doctor_name: "",
        appointment_date: "",
        appointment_time: "",
        patient_id: ""
      });
    } catch (err) {
      console.error("Appointment submit error:", err);
      alert("Failed to add appointment");
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    marginTop: "6px",
    marginBottom: "14px"
  };

  const labelStyle = {
    fontWeight: "600",
    color: "#2c3e50"
  };

  return (
    <div>
      <h2>Add Appointment</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: "500px",
          marginTop: "20px"
        }}
      >
        <label style={labelStyle}>Select Patient</label>
        <select
          onChange={handlePatientChange}
          value={form.patient_id}
          style={inputStyle}
        >
          <option value="">Select Patient</option>
          {patients.map((p) => (
            <option key={p.patient_id} value={p.patient_id}>
              {p.first_name} {p.last_name}
            </option>
          ))}
        </select>

        <label style={labelStyle}>Select Doctor</label>
        <select
          onChange={handleDoctorChange}
          defaultValue=""
          style={inputStyle}
        >
          <option value="">Select Doctor</option>
          {doctors.map((d) => (
            <option key={d.doctor_id} value={d.doctor_id}>
              {d.first_name} {d.last_name}
            </option>
          ))}
        </select>

        <label style={labelStyle}>Appointment Date</label>
        <input
          type="date"
          name="appointment_date"
          value={form.appointment_date}
          onChange={handleChange}
          style={inputStyle}
        />

        <label style={labelStyle}>Appointment Time</label>
        <input
          type="time"
          name="appointment_time"
          value={form.appointment_time}
          onChange={handleChange}
          style={inputStyle}
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
          Add Appointment
        </button>
      </form>
    </div>
  );
}

export default AddAppointment;