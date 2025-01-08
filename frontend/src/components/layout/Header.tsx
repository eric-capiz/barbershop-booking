import { useState } from "react";
import { Link } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
import "./_header.scss";
import AuthModal from "../auth/AuthModal";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authType, setAuthType] = useState<"login" | "register">("login");

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleAuthClick = (type: "login" | "register") => {
    setAuthType(type);
    setIsAuthModalOpen(true);
    setIsMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          SANCHEZ BARBER
        </Link>

        <button
          className="menu-toggle"
          onClick={toggleMenu}
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
          </div>
        </nav>
      </div>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialView={authType}
      />
    </header>
  );
};

export default Header;
