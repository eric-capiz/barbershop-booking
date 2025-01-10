import { useEffect } from "react";
import { useGallery } from "../../hooks/useGallery";
import { useGalleryStore } from "../../store/galleryStore";
import GallerySection from "./components/GallerySection";
import "./_gallery.scss";

const Gallery = () => {
  const { data: galleryItems, isLoading } = useGallery();
  const setGallery = useGalleryStore((state) => state.setGallery);

  useEffect(() => {
    if (galleryItems) {
      setGallery(galleryItems);
    }
  }, [galleryItems, setGallery]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="gallery-page">
      <h1>Our Work</h1>
      <GallerySection />
    </div>
  );
};

export default Gallery;
