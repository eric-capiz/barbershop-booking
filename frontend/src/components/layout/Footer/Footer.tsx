import "./_footer.scss";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <span className="location">
          Location: 7105 Unit #17 Virginia Rd, Crystal Lake, IL 60014
        </span>
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
