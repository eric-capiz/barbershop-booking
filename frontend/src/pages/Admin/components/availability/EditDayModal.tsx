import { useState } from "react";
import { format } from "date-fns";
import { FaTimes, FaClock } from "react-icons/fa";
import { ScheduleDay } from "@/types/availability.types";

interface EditDayModalProps {
  date: Date;
  availability: ScheduleDay | null;
  onClose: () => void;
  onSave: (hours: {
    startTime: string | null;
    endTime: string | null;
  }) => Promise<void>;
}

const EditDayModal = ({
  date,
  availability,
  onClose,
  onSave,
}: EditDayModalProps) => {
  const [isWorking, setIsWorking] = useState(
    availability?.isWorkingDay ?? false
  );
  const [startTime, setStartTime] = useState(
    availability?.workHours?.start
      ? format(new Date(availability.workHours.start), "HH:mm")
      : "09:00"
  );
  const [endTime, setEndTime] = useState(
    availability?.workHours?.end
      ? format(new Date(availability.workHours.end), "HH:mm")
      : "18:00"
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (!isWorking) {
        await onSave({ startTime: null, endTime: null });
      } else {
        const dateStr = format(date, "yyyy-MM-dd");
        await onSave({
          startTime: `${dateStr}T${startTime}:00`,
          endTime: `${dateStr}T${endTime}:00`,
        });
      }
    } catch (error) {
      console.error("Failed to save availability:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content availability-modal">
        <div className="modal-header">
          <h3>
            <FaClock /> Set Availability for {format(date, "MMMM d, yyyy")}
          </h3>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="availability-form">
          <div className="working-toggle">
            <label>
              <input
                type="checkbox"
                checked={isWorking}
                onChange={(e) => setIsWorking(e.target.checked)}
              />
              Available for appointments
            </label>
          </div>

          {isWorking && (
            <div className="time-inputs">
              <div className="form-group">
                <label htmlFor="startTime">Start Time</label>
                <input
                  type="time"
                  id="startTime"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="endTime">End Time</label>
                <input
                  type="time"
                  id="endTime"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div className="modal-actions">
            <button type="submit" className="btn-save" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Availability"}
            </button>
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDayModal;
