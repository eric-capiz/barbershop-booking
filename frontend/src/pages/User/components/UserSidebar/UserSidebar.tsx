import { useState } from "react";
import {
  FaUser,
  FaCalendarAlt,
  FaRegStar,
  FaChevronDown,
} from "react-icons/fa";
import "./_userSidebar.scss";

interface UserSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const UserSidebar = ({ activeSection, setActiveSection }: UserSidebarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { id: "profile", label: "Profile", icon: <FaUser /> },
    { id: "appointments", label: "Appointments", icon: <FaCalendarAlt /> },
    { id: "reviews", label: "My Reviews", icon: <FaRegStar /> },
  ];

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
    setIsMenuOpen(false);
  };

  const activeItem = menuItems.find((item) => item.id === activeSection);

  return (
    <aside className="user-sidebar">
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

export default UserSidebar;
