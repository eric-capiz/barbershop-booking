import { useState } from "react";
import { FaSave, FaTimes, FaEdit } from "react-icons/fa";
import UserSidebar from "../components/UserSidebar/UserSidebar";
import { useUser, useUpdateUser } from "@/hooks/user/useUser";
import UserAppointments from "../components/appointments/UserAppointments";
import UserReviews from "../components/reviews/UserReviews";
import "./_userProfile.scss";

const UserProfile = () => {
  const [activeSection, setActiveSection] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const { data: user, isLoading } = useUser();
  const updateUser = useUpdateUser();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleEdit = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      username: user?.username || "",
      password: "",
      confirmPassword: "",
    });
    setIsEditing(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
        username: formData.username,
        ...(formData.password && { password: formData.password }),
      };

      await updateUser.mutateAsync(updateData);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const renderProfile = () => {
    if (isLoading) return <div>Loading...</div>;

    if (isEditing) {
      return (
        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>New Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Leave blank to keep current password"
            />
          </div>

          <div className="form-group">
            <label>Confirm Password:</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Leave blank to keep current password"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-save">
              <FaSave /> Save
            </button>
            <button
              type="button"
              className="btn-cancel"
              onClick={() => setIsEditing(false)}
            >
              <FaTimes /> Cancel
            </button>
          </div>
        </form>
      );
    }

    return (
      <div className="profile-info">
        <div className="profile-header">
          <h2>Profile Information</h2>
          <button className="btn-edit" onClick={handleEdit}>
            <FaEdit /> Edit
          </button>
        </div>
        <div className="info-group">
          <label>Name:</label>
          <span>{user?.name}</span>
        </div>
        <div className="info-group">
          <label>Email:</label>
          <span>{user?.email}</span>
        </div>
        <div className="info-group">
          <label>Username:</label>
          <span>{user?.username}</span>
        </div>
      </div>
    );
  };

  const renderSection = () => {
    switch (activeSection) {
      case "profile":
        return renderProfile();
      case "appointments":
        return <UserAppointments />;
      case "reviews":
        return <UserReviews />;
      default:
        return renderProfile();
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
