import { useState } from "react";
import { useUpdateProfile } from "@hooks/admin/useProfile";
import { BarberProfile } from "@/types/auth.types";
import {
  FaSave,
  FaTimes,
  FaInstagram,
  FaFacebook,
  FaTwitter,
} from "react-icons/fa";

interface EditSocialMediaProps {
  profile: BarberProfile;
  onClose: () => void;
}

const EditSocialMedia = ({ profile, onClose }: EditSocialMediaProps) => {
  const updateProfile = useUpdateProfile();
  const [formData, setFormData] = useState({
    socialMedia: {
      instagram: profile.socialMedia.instagram || "",
      facebook: profile.socialMedia.facebook || "",
      twitter: profile.socialMedia.twitter || "",
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      socialMedia: {
        ...prev.socialMedia,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile.mutateAsync(formData);
      onClose();
    } catch (error) {
      console.error("Failed to update social media:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="edit-form edit-social">
      <div className="form-group">
        <label htmlFor="instagram">
          <FaInstagram /> Instagram:
        </label>
        <div className="social-input">
          <span className="prefix">@</span>
          <input
            type="text"
            id="instagram"
            name="instagram"
            value={formData.socialMedia.instagram}
            onChange={handleChange}
            placeholder="username"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="facebook">
          <FaFacebook /> Facebook:
        </label>
        <div className="social-input">
          <span className="prefix">facebook.com/</span>
          <input
            type="text"
            id="facebook"
            name="facebook"
            value={formData.socialMedia.facebook}
            onChange={handleChange}
            placeholder="username"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="twitter">
          <FaTwitter /> Twitter:
        </label>
        <div className="social-input">
          <span className="prefix">@</span>
          <input
            type="text"
            id="twitter"
            name="twitter"
            value={formData.socialMedia.twitter}
            onChange={handleChange}
            placeholder="username"
          />
        </div>
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

export default EditSocialMedia;
