import { useState } from "react";
import { Link } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
import { useLogout } from "@hooks/useAuth";
import { useAuthStore } from "@/store/authStore";
import { useUser } from "@hooks/useUser";
import AuthModal from "@components/auth/AuthModal";
import { FaUser } from "react-icons/fa";
import "./_header.scss";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authType, setAuthType] = useState<"login" | "register">("login");
  const logout = useLogout();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const user = useAuthStore((state) => state.user);

  const handleAuthClick = (type: "login" | "register") => {
    setAuthType(type);
    setIsAuthModalOpen(true);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false);
    setAuthType("login");
  };

  return (
    <>
      <header className="header">
        <div className="header-content">
          <Link to="/" onClick={() => setIsMenuOpen(false)} className="logo">
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
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="nav-link"
            >
              Home
            </Link>
            <Link
              to="/about"
              onClick={() => setIsMenuOpen(false)}
              className="nav-link"
            >
              About
            </Link>
            <Link
              to="/my-work"
              onClick={() => setIsMenuOpen(false)}
              className="nav-link"
            >
              My Work
            </Link>
            <Link
              to="/contact"
              onClick={() => setIsMenuOpen(false)}
              className="nav-link"
            >
              Contact
            </Link>
            <div className="auth-links">
              {isAuthenticated ? (
                <>
                  {isAdmin ? (
                    <Link
                      to="/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className="nav-link auth-link dashboard"
                    >
                      Admin Dashboard
                    </Link>
                  ) : (
                    <Link
                      to="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="nav-link auth-link profile"
                    >
                      <FaUser className="profile-icon" />
                      <span>{user?.username}</span>
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="nav-link auth-link logout"
                  >
                    Logout
                  </button>
                </>
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
        onClose={handleCloseAuthModal}
        initialView={authType}
        key={`${isAuthModalOpen}-${authType}`}
      />
    </>
  );
};

export default Header;
