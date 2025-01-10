import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Gallery from "./pages/Gallery/Gallery";
import ProtectedAdminRoute from "./components/auth/ProtectedAdminRoute";
import ProtectedUserRoute from "./components/auth/ProtectedUserRoute";
import AdminDashboard from "./pages/Admin/AdminDashboard";
function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/my-work" element={<Gallery />} />
          <Route path="/about" element={<About />} />
          {/* Auth Routes */}
          <Route path="/login" element={<div>Login</div>} />
          <Route path="/register" element={<div>Register</div>} />

          {/* Protected User Routes */}
          <Route
            path="/appointments"
            element={
              <ProtectedUserRoute>
                <div>Appointments</div>
              </ProtectedUserRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedUserRoute>
                <div>Profile</div>
              </ProtectedUserRoute>
            }
          />

          {/* Protected Admin Routes */}
          <Route
            path="/dashboard/*"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
