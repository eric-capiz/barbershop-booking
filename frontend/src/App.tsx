import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Gallery from "./pages/Gallery/Gallery";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/about" element={<About />} />
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
