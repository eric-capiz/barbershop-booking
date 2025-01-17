import React, { useState } from "react";
import Modal from "./Modal";
import "./_rejectionModal.scss";

interface RejectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (note: string) => void;
  appointmentType: "pending" | "reschedule-pending";
}

const RejectionModal = ({
  isOpen,
  onClose,
  onConfirm,
  appointmentType,
}: RejectionModalProps) => {
  const [note, setNote] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(note);
    setNote(""); // Reset after submission
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Reject ${
        appointmentType === "reschedule-pending"
          ? "Reschedule Request"
          : "Appointment"
      }`}
    >
      <form onSubmit={handleSubmit} className="rejection-form">
        <p className="rejection-notice">
          Please provide a reason for rejection. This will be visible to the
          client.
        </p>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Enter rejection reason..."
          required
          rows={4}
        />
        <div className="rejection-actions">
          <button type="button" onClick={onClose} className="btn-cancel">
            Cancel
          </button>
          <button type="submit" className="btn-reject" disabled={!note.trim()}>
            Confirm Rejection
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default RejectionModal;
