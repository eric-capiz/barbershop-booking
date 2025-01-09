import { useState, useEffect } from "react";
import "./_haircutGallery.scss";

const HaircutGallery = () => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [rotation, setRotation] = useState(0);
  const totalImages = 12;

  useEffect(() => {
    const timer = setInterval(() => {
      setRotation((prev) => prev + 360);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev === totalImages ? 1 : prev + 1));
      }, 750);
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  const nextIndex = currentIndex === totalImages ? 1 : currentIndex + 1;

  return (
    <div className="haircut-gallery">
      <div
        className="gallery-card"
        style={{ transform: `rotateY(${rotation}deg)` }}
      >
        <div className="card-face front">
          <img
            src={`/images/haircuts/style${currentIndex}.jpeg`}
            alt={`Haircut style ${currentIndex}`}
          />
        </div>
        <div className="card-face back">
          <img
            src={`/images/haircuts/style${nextIndex}.jpeg`}
            alt={`Haircut style ${nextIndex}`}
          />
        </div>
      </div>
    </div>
  );
};

export default HaircutGallery;
