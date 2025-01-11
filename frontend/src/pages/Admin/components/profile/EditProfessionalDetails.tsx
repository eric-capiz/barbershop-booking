import { useState } from "react";
import { useUpdateProfile } from "@hooks/useProfile";
import { BarberProfile } from "@/types/auth.types";
import { FaSave, FaTimes, FaPlus, FaTrash } from "react-icons/fa";

interface EditProfessionalDetailsProps {
  profile: BarberProfile;
  onClose: () => void;
}

const EditProfessionalDetails = ({
  profile,
  onClose,
}: EditProfessionalDetailsProps) => {
  const updateProfile = useUpdateProfile();
  const [formData, setFormData] = useState({
    yearsOfExperience: profile.yearsOfExperience,
    specialties: [...profile.specialties],
  });
  const [newSpecialty, setNewSpecialty] = useState("");

  const handleYearsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setFormData((prev) => ({
      ...prev,
      yearsOfExperience: value,
    }));
  };

  const handleAddSpecialty = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSpecialty.trim()) {
      setFormData((prev) => ({
        ...prev,
        specialties: [...prev.specialties, newSpecialty.trim()],
      }));
      setNewSpecialty("");
    }
  };

  const handleRemoveSpecialty = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      specialties: prev.specialties.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile.mutateAsync(formData);
      onClose();
    } catch (error) {
      console.error("Failed to update professional details:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="edit-form">
      <div className="form-group">
        <label htmlFor="yearsOfExperience">Years of Experience:</label>
        <input
          type="number"
          id="yearsOfExperience"
          name="yearsOfExperience"
          value={formData.yearsOfExperience}
          onChange={handleYearsChange}
          min="0"
          required
        />
      </div>

      <div className="form-group">
        <label>Specialties:</label>
        <div className="specialties-list">
          {formData.specialties.map((specialty, index) => (
            <div key={index} className="specialty-item">
              <span>{specialty}</span>
              <button
                type="button"
                className="btn-remove"
                onClick={() => handleRemoveSpecialty(index)}
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>

        <div className="add-specialty">
          <input
            type="text"
            value={newSpecialty}
            onChange={(e) => setNewSpecialty(e.target.value)}
            placeholder="Add new specialty"
          />
          <button
            type="button"
            className="btn-add"
            onClick={handleAddSpecialty}
            disabled={!newSpecialty.trim()}
          >
            <FaPlus />
          </button>
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

export default EditProfessionalDetails;
