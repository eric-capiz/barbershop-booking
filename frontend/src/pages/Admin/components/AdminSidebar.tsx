import { useState } from "react";
import {
  FaUserAlt,
  FaCut,
  FaImage,
  FaClock,
  FaCalendarAlt,
  FaChevronDown,
} from "react-icons/fa";

interface AdminSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const AdminSidebar = ({
  activeSection,
  setActiveSection,
}: AdminSidebarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { id: "profile", label: "Profile", icon: <FaUserAlt /> },
    { id: "services", label: "Services", icon: <FaCut /> },
    { id: "gallery", label: "Gallery", icon: <FaImage /> },
    { id: "availability", label: "Availability", icon: <FaClock /> },
    { id: "appointments", label: "Appointments", icon: <FaCalendarAlt /> },
  ];

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
    setIsMenuOpen(false);
  };

  const activeItem = menuItems.find((item) => item.id === activeSection);

  return (
    <aside className="admin-sidebar">
      <button
        className="mobile-menu-button"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <span className="current-section">
          <span className="icon">{activeItem?.icon}</span>
          <span className="label">{activeItem?.label}</span>
        </span>
        <FaChevronDown className={`chevron ${isMenuOpen ? "open" : ""}`} />
      </button>

      <nav className={isMenuOpen ? "open" : ""}>
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`sidebar-item ${
              activeSection === item.id ? "active" : ""
            }`}
            onClick={() => handleSectionChange(item.id)}
          >
            <span className="icon">{item.icon}</span>
            <span className="label">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
