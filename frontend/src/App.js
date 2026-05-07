import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import AddPatient from "./pages/AddPatient";
import ViewPatients from "./pages/ViewPatients";
import ViewDoctors from "./pages/ViewDoctors";
import ViewAppointments from "./pages/ViewAppointments";
import AddAppointment from "./pages/AddAppointment";
import Dashboard from "./pages/Dashboard";
import AIPathology from "./pages/AIPathology";
import AddLabReport from "./pages/AddLabReport";

function App() {
  const navStyle = {
    color: "#ffffff",
    textDecoration: "none",
    fontWeight: "500",
    padding: "10px 14px",
    borderRadius: "8px",
    backgroundColor: "#34495e"
  };

  return (
    <Router>
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#f4f6f8",
          fontFamily: "Arial, sans-serif",
          padding: "20px"
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto"
          }}
        >
          <div
            style={{
              backgroundColor: "#1f3b57",
              color: "white",
              padding: "24px",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              marginBottom: "20px"
            }}
          >
            <h1 style={{ margin: 0 }}>EMR System</h1>
            <p style={{ marginTop: "8px", marginBottom: 0 }}>
              Electronic Medical Record Management Dashboard
            </p>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              marginBottom: "20px"
            }}
          >
            <Link to="/dashboard" style={navStyle}>Dashboard</Link>
            <Link to="/" style={navStyle}>Home</Link>
            <Link to="/add-patient" style={navStyle}>Add Patient</Link>
            <Link to="/patients" style={navStyle}>View Patients</Link>
            <Link to="/doctors" style={navStyle}>Doctors</Link>
            <Link to="/appointments" style={navStyle}>Appointments</Link>
            <Link to="/add-appointment" style={navStyle}>Add Appointment</Link>
            <Link to="/ai-pathology" style={navStyle}>AI Pathology</Link>
            <Link to="/add-lab-report" style={navStyle}>Add Lab Report</Link>
          </div>

          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "24px",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
            }}
          >
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/" element={<Home />} />
              <Route path="/add-patient" element={<AddPatient />} />
              <Route path="/patients" element={<ViewPatients />} />
              <Route path="/doctors" element={<ViewDoctors />} />
              <Route path="/appointments" element={<ViewAppointments />} />
              <Route path="/add-appointment" element={<AddAppointment />} />
              <Route path="/ai-pathology" element={<AIPathology />} />
              <Route path="/add-lab-report" element={<AddLabReport />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;