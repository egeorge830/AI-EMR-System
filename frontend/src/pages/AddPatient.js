import { useState } from "react";
import axios from "axios";

function AddPatient() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    dob: "",
    gender: "",
    phone: "",
    email: "",
    address: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/api/patients", form);
    alert("Patient added!");
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
      <h2>Add Patient</h2>

      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: "500px",
          marginTop: "20px"
        }}
      >
        <input name="first_name" placeholder="First Name" onChange={handleChange} style={inputStyle} />
        <input name="last_name" placeholder="Last Name" onChange={handleChange} style={inputStyle} />
        <input name="dob" type="date" onChange={handleChange} style={inputStyle} />
        <input name="gender" placeholder="Gender" onChange={handleChange} style={inputStyle} />
        <input name="phone" placeholder="Phone" onChange={handleChange} style={inputStyle} />
        <input name="email" placeholder="Email" onChange={handleChange} style={inputStyle} />
        <input name="address" placeholder="Address" onChange={handleChange} style={inputStyle} />

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
          Add Patient
        </button>
      </form>
    </div>
  );
}

export default AddPatient;