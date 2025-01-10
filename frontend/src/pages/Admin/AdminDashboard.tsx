import { useState } from "react";
import AdminSidebar from "./components/AdminSidebar";
import AdminProfile from "./components/profile/AdminProfile";
import AdminServices from "./components/services/AdminServices";
import AdminGallery from "./components/gallery/AdminGallery";
import "./_adminDashboard.scss";

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("profile");

  const renderSection = () => {
    switch (activeSection) {
      case "profile":
        return <AdminProfile />;
      case "services":
        return <AdminServices />;
      case "gallery":
        return <AdminGallery />;
      case "availability":
        return <div>Availability</div>;
      default:
        return <AdminProfile />;
    }
  };

  return (
    <div className="admin-dashboard">
      <AdminSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      <main className="admin-content">{renderSection()}</main>
    </div>
  );
};

export default AdminDashboard;
