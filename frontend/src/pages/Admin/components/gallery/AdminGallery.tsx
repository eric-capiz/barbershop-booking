import { useGallery } from "@hooks/useGallery";
import { FaTrash, FaEdit } from "react-icons/fa";
import "./_adminGallery.scss";

const AdminGallery = () => {
  const { data: gallery, isLoading } = useGallery();

  console.log("Gallery Data:", gallery);

  if (isLoading) return <div>Loading...</div>;
  if (!gallery) return <div>No gallery items found</div>;

  return (
    <div className="admin-gallery">
      <div className="admin-gallery__header">
        <h2>Gallery Management</h2>
        <button className="btn-primary">Add New Image</button>
      </div>

      <div className="admin-gallery__grid">
        {gallery.map((item) => (
          <div key={item._id} className="gallery-item">
            <div className="gallery-item__image">
              <img src={item.image.url} alt={item.description} />
              <div className="gallery-item__actions">
                <button className="action-btn edit">
                  <FaEdit />
                </button>
                <button className="action-btn delete">
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
    </div>
  );
};

export default AdminGallery;
