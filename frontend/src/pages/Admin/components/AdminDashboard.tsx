import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

const AdminDashboard = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState("Dashboard"); // Or whatever default

  return (
    <div className="admin-dashboard">
      <div className="admin-sidebar">
        <button
          className="mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span className="current-section">{currentSection}</span>
          <FaChevronDown
            className={`toggle-icon ${isMobileMenuOpen ? "open" : ""}`}
          />
        </button>

        <nav className={isMobileMenuOpen ? "open" : ""}></nav>
      </div>

      {isMobileMenuOpen && (
        <div
          className="mobile-backdrop open"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div className="admin-content">{/* Your existing content */}</div>
    </div>
  );
};
