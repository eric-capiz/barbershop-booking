import { useState } from "react";
import { useGallery } from "@hooks/useGallery";
import { FaTrash, FaEdit } from "react-icons/fa";
import AddGalleryItem from "./AddGalleryItem";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import EditGalleryItem from "./EditGalleryItem";
import "./_adminGallery.scss";

type ModalType = "add" | "delete" | "edit" | null;

const AdminGallery = () => {
  const { data: gallery, isLoading } = useGallery();
  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setSelectedItemId(id);
    setModalType("delete");
  };

  const handleCloseModal = () => {
    setModalType(null);
    setSelectedItemId(null);
  };

  if (isLoading) return <div>Loading...</div>;
  if (!gallery) return <div>No gallery items found</div>;

  return (
    <div className="admin-gallery">
      <div className="admin-gallery__header">
        <h2>Gallery Management</h2>
        <button className="btn-primary" onClick={() => setModalType("add")}>
          Add New Image
        </button>
      </div>

      <div className="admin-gallery__grid">
        {gallery.map((item) => (
          <div key={item._id} className="gallery-item">
            <div className="gallery-item__image">
              <img src={item.image.url} alt={item.description} />
              <div className="gallery-item__actions">
                <button
                  className="action-btn edit"
                  onClick={() => {
                    setSelectedItemId(item._id);
                    setModalType("edit");
                  }}
                >
                  <FaEdit />
                </button>
                <button
                  className="action-btn delete"
                  onClick={() => handleDelete(item._id)}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
            <div className="gallery-item__info">
              <p className="description">{item.description}</p>
              <div className="tags">
                {item.tags.map((tag, index) => (
                  <span key={index} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {modalType === "add" && <AddGalleryItem onClose={handleCloseModal} />}

      {modalType === "delete" && selectedItemId && (
        <DeleteConfirmationModal
          itemId={selectedItemId}
          onClose={handleCloseModal}
        />
      )}

      {modalType === "edit" && selectedItemId && (
        <EditGalleryItem
          item={gallery.find((item) => item._id === selectedItemId)!}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default AdminGallery;
