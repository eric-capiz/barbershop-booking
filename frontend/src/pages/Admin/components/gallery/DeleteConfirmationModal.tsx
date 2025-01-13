import { useDeleteGalleryItem } from "@hooks/admin/useGallery";
import { FaTimes, FaExclamationTriangle } from "react-icons/fa";
import "./_deleteConfirmationModal.scss";

interface DeleteConfirmationModalProps {
  itemId: string;
  onClose: () => void;
}

const DeleteConfirmationModal = ({
  itemId,
  onClose,
}: DeleteConfirmationModalProps) => {
  const deleteGalleryItem = useDeleteGalleryItem();

  const handleDelete = async () => {
    try {
      await deleteGalleryItem.mutateAsync(itemId);
      onClose();
    } catch (error) {
      console.error("Failed to delete gallery item:", error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content delete-confirmation">
        <div className="modal-header">
          <h3>Delete Gallery Item</h3>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="modal-body">
          <div className="warning-icon">
            <FaExclamationTriangle />
          </div>
          <p>Are you sure you want to delete this gallery item?</p>
          <p className="warning-text">This action cannot be undone.</p>
        </div>

        <div className="modal-actions">
          <button
            className="btn-delete"
            onClick={handleDelete}
            disabled={deleteGalleryItem.isPending}
          >
            {deleteGalleryItem.isPending ? "Deleting..." : "Delete"}
          </button>
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
