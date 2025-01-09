import { FaInstagram, FaFacebook, FaTwitter } from "react-icons/fa";
import { useProfileStore } from "../../../store/profileStore";
import "./_footer.scss";

const Footer = () => {
  const profile = useProfileStore((state) => state.profile);

  return (
    <footer className="footer">
      <div className="footer-content">
        <span className="location">
          Location: 7105 Unit #17 Virginia Rd, Crystal Lake, IL 60014
        </span>
        <div className="social-links">
          {profile?.socialMedia.instagram && (
            <a
              href={`https://instagram.com/${profile.socialMedia.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram />
            </a>
          )}
          {profile?.socialMedia.facebook && (
            <a
              href={`https://facebook.com/${profile.socialMedia.facebook}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebook />
            </a>
          )}
          {profile?.socialMedia.twitter && (
            <a
              href={`https://twitter.com/${profile.socialMedia.twitter}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTwitter />
            </a>
          )}
        </div>
        <span className="contact">
          Contact: <a href="tel:+12244788364">(224) 478-8364</a>
        </span>
        <span className="copyright">
          © {new Date().getFullYear()} Sanchez Barber. All rights reserved.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
