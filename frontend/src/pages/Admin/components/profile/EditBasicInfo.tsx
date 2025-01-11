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
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile.mutateAsync(formData);
      onClose();
    } catch (error) {
      console.error("Failed to update profile:", error);
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
