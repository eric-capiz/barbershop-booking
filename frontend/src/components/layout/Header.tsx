import { useState } from "react";
import { Link } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
import AuthModal from "../auth/AuthModal";
import { useLogout } from "../../hooks/useAuth";
import "./_header.scss";
import { useAuthStore } from "../../store/authStore";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authType, setAuthType] = useState<"login" | "register">("login");
  const logout = useLogout();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const handleAuthClick = (type: "login" | "register") => {
    setAuthType(type);
    setIsAuthModalOpen(true);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="header">
        <div className="header-content">
          <Link to="/" className="logo">
            SANCHEZ BARBER
          </Link>

          <button
            className="menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>

          <nav className={`nav-menu ${isMenuOpen ? "active" : ""}`}>
            <Link to="/" className="nav-link">
              Home
            </Link>
            <Link to="/about" className="nav-link">
              About Us
            </Link>
            <Link to="/services" className="nav-link">
              Services
            </Link>
            <Link to="/gallery" className="nav-link">
              Gallery
            </Link>
            <Link to="/contact" className="nav-link">
              Contact
            </Link>
            <div className="auth-links">
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="nav-link auth-link logout"
                >
                  Logout
                </button>
              ) : (
                <>
                  <button
                    onClick={() => handleAuthClick("login")}
                    className="nav-link auth-link login"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => handleAuthClick("register")}
                    className="nav-link auth-link signup"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </nav>
        </div>
      </header>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialView={authType}
      />
    </>
  );
};

export default Header;
