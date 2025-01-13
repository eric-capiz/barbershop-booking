import { useState } from "react";
import UserSidebar from "../components/UserSidebar/UserSidebar";
import "./_userProfile.scss";

const UserProfile = () => {
  const [activeSection, setActiveSection] = useState("profile");

  const renderSection = () => {
    switch (activeSection) {
      case "profile":
        return <div>Profile Content Here</div>;
      case "appointments":
        return <div>Appointments Content Here</div>;
      case "reviews":
        return <div>Reviews Content Here</div>;
      default:
        return <div>Profile Content Here</div>;
    }
  };

  return (
    <div className="user-profile">
      <UserSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      <main className="user-profile__content">{renderSection()}</main>
    </div>
  );
};

export default UserProfile;
