import { Outlet } from "react-router-dom";
import UserSidebar from "../components/UserSidebar/UserSidebar";
import "./_userProfile.scss";

const UserProfile = () => {
  return (
    <div className="user-profile">
      <UserSidebar />
      <main className="user-profile__content">
        <Outlet />
      </main>
    </div>
  );
};

export default UserProfile;
