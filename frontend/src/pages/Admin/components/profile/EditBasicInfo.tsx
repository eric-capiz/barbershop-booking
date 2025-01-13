import { useState } from "react";
import { useUpdateProfile } from "@hooks/useProfile";
import { BarberProfile } from "@/types/auth.types";
import { FaSave, FaTimes } from "react-icons/fa";

interface EditBasicInfoProps {
  profile: BarberProfile;
  onClose: () => void;
}

const EditBasicInfo = ({ profile, onClose }: EditBasicInfoProps) => {
  const updateProfile = useUpdateProfile();
  const [formData, setFormData] = useState({
    name: profile.name,
    email: profile.email,
    username: profile.username,
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (["newPassword", "confirmPassword"].includes(name)) {
      setPasswordError("");
    }
  };

  const validatePasswords = () => {
    if (formData.newPassword) {
      if (formData.newPassword.length < 6) {
        setPasswordError("New password must be at least 6 characters");
        return false;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        setPasswordError("Passwords do not match");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePasswords()) {
      return;
    }

    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
        username: formData.username,
        ...(formData.newPassword && {
          password: formData.newPassword,
        }),
      };

      await updateProfile.mutateAsync(updateData);
      onClose();
    } catch (error) {
      console.error("Failed to update profile:", error);
      if (error.response?.data?.message) {
        setPasswordError(error.response.data.message);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="edit-form">
      <div className="form-group">
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
      </div>

      <div className="password-section">
        <h4>Change Password</h4>
        <div className="form-group">
          <label htmlFor="newPassword">New Password:</label>
          <input
            type={showPassword ? "text" : "password"}
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            minLength={6}
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type={showPassword ? "text" : "password"}
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>

        <div className="show-password">
          <label>
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            Show passwords
          </label>
        </div>

        {passwordError && <div className="error-message">{passwordError}</div>}
      </div>

      <div className="form-actions">
        <button
          type="submit"
          className="btn-save"
          disabled={updateProfile.isPending}
        >
          <FaSave /> Save
        </button>
        <button type="button" className="btn-cancel" onClick={onClose}>
          <FaTimes /> Cancel
        </button>
      </div>
    </form>
  );
};

export default EditBasicInfo;
