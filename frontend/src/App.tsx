import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home/Home";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<div>Services</div>} />
          <Route path="/gallery" element={<div>Gallery</div>} />

          {/* Auth Routes */}
          <Route path="/login" element={<div>Login</div>} />
          <Route path="/register" element={<div>Register</div>} />

          {/* Protected User Routes */}
          <Route path="/appointments" element={<div>Appointments</div>} />
          <Route path="/profile" element={<div>Profile</div>} />

          {/* Protected Admin Routes */}
          <Route path="/admin/*" element={<div>Admin Dashboard</div>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
