import { useAuthStore } from "@/store/authStore";
import HaircutGallery from "../HaircutGallery/HaircutGallery";
import "./_hero.scss";

const Hero = () => {
  const { isAuthenticated, isAdmin } = useAuthStore();

  const showBookButton = isAuthenticated && !isAdmin;

  const handleBookNow = () => {
    console.log("Book Now clicked");
  };

  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-text">
          <h1>Sanchez Barber</h1>
          <p>Quality cuts. Professional service.</p>
          {showBookButton && (
            <button className="book-button" onClick={handleBookNow}>
              Book Now
            </button>
          )}
        </div>
        <HaircutGallery />
      </div>
    </section>
  );
};

export default Hero;
