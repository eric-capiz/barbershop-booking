import { useGalleryStore } from "@/store/admin/galleryStore";

const GallerySection = () => {
  const gallery = useGalleryStore((state) => state.gallery);

  return (
    <section className="gallery-grid">
      {gallery.map((item) => (
        <div key={item._id} className="gallery-item">
          <img src={item.image.url} alt={item.description} />
          <div className="gallery-item-overlay">
            <p>{item.description}</p>
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
    </section>
  );
};

export default GallerySection;
