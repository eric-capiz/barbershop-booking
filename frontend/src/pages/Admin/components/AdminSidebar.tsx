import {
  FaUserAlt,
  FaCut,
  FaImage,
  FaClock,
  FaCalendarAlt,
} from "react-icons/fa";
// import "./_adminSidebar.scss";

interface AdminSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const AdminSidebar = ({
  activeSection,
  setActiveSection,
}: AdminSidebarProps) => {
  const menuItems = [
    { id: "profile", label: "Profile", icon: <FaUserAlt /> },
    { id: "services", label: "Services", icon: <FaCut /> },
    { id: "gallery", label: "Gallery", icon: <FaImage /> },
    { id: "availability", label: "Availability", icon: <FaClock /> },
    { id: "appointments", label: "Appointments", icon: <FaCalendarAlt /> },
  ];

  return (
    <aside className="admin-sidebar">
      <nav>
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`sidebar-item ${
              activeSection === item.id ? "active" : ""
            }`}
            onClick={() => setActiveSection(item.id)}
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
