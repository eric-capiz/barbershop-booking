import { useState, useEffect } from "react";
import { useGallery } from "@/hooks/useGallery";
import { useGalleryStore } from "@/store/galleryStore";
import "./_haircutGallery.scss";

const HaircutGallery = () => {
  const { data: galleryData, isLoading } = useGallery();
  const { gallery, setGallery } = useGalleryStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (galleryData) {
      setGallery(galleryData);
    }
  }, [galleryData, setGallery]);

  useEffect(() => {
    if (gallery.length === 0) return;

    const timer = setInterval(() => {
      setRotation((prev) => prev + 360);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));
      }, 750);
    }, 4500);

    return () => clearInterval(timer);
  }, [gallery.length]);

  if (isLoading || gallery.length === 0) return <div>Loading...</div>;

  const nextIndex = currentIndex === gallery.length - 1 ? 0 : currentIndex + 1;

  return (
    <div className="haircut-gallery">
      <div
        className="gallery-card"
        style={{ transform: `rotateY(${rotation}deg)` }}
      >
        <div className="card-face front">
          <img src={gallery[currentIndex].image.url} alt="Haircut style" />
        </div>
        <div className="card-face back">
          <img src={gallery[nextIndex].image.url} alt="Haircut style" />
        </div>
      </div>
    </div>
  );
};

export default HaircutGallery;
