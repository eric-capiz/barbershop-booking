import { NavLink } from "react-router-dom";
import { FaUser, FaCalendarAlt, FaRegStar } from "react-icons/fa";
import "./_userSidebar.scss";

const UserSidebar = () => {
  return (
    <aside className="user-sidebar">
      <nav className="user-nav">
        <NavLink
          to="/profile"
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          end
        >
          <FaUser />
          <span>Profile</span>
        </NavLink>

        <NavLink
          to="/profile/appointments"
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
        >
          <FaCalendarAlt />
          <span>Appointments</span>
        </NavLink>

        <NavLink
          to="/profile/reviews"
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
        >
          <FaRegStar />
          <span>Reviews</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default UserSidebar;
