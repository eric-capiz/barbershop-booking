import HaircutGallery from "../HaircutGallery/HaircutGallery";
import "./_hero.scss";

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-text">
          <h1>Sanchez Barber</h1>
          <p>Quality cuts. Professional service.</p>
          <button className="book-button">Book Now</button>
        </div>
        <HaircutGallery />
      </div>
    </section>
  );
};

export default Hero;
