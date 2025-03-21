import { FaInstagram, FaFacebook, FaTwitter } from "react-icons/fa";
import { useProfileStore } from "@/store/admin/profileStore";
import "./_footer.scss";

const Footer = () => {
  const profile = useProfileStore((state) => state.profile);

  return (
    <footer className="footer">
      <div className="footer-content">
        <span className="location">
          Location: 123 fake street Unit #17 State Rd, Crystal Lake, IL 60014
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
          Contact: <a>(555) 555-5555</a>
        </span>
        <span className="copyright">
          Developed by{" "}
          <a
            href="https://www.ericcapiz.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Eric Capiz
          </a>{" "}
          © {new Date().getFullYear()}
        </span>
      </div>
    </footer>
  );
};

export default Footer;
