import { useState } from "react";
import { Link } from "react-router-dom";
import { RxHamburgerMenu, RxCross2 } from "react-icons/rx";
import "./_header.scss";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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
          {isMenuOpen ? <RxCross2 size={24} /> : <RxHamburgerMenu size={24} />}
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
            <Link to="/login" className="nav-link auth-link">
              Login
            </Link>
            <Link to="/register" className="nav-link auth-link signup">
              Sign Up
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
