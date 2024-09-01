import { Link } from "react-router-dom";

interface FooterProps {
  className: string;
}

const Footer: React.FC<FooterProps> = ({className}) => {
  return (
    <footer className={className}>
      <div>
        <h1>Useful Links</h1>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/washika-dao">WashikaDAO</Link>
          </li>
          <li>
            <Link to="/explore">Explore</Link>
          </li>
          <li>
            <Link to="/karibu">Karibu</Link>
          </li>
        </ul>{" "}
      </div>
      <div className="social-media-icons">
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon"
        >
          <i className="fab fa-facebook-f"></i>
        </a>
        <a
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon"
        >
          <i className="fab fa-twitter"></i>
        </a>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon"
        >
          <i className="fab fa-instagram"></i>
        </a>
        <a
          href="https://linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon"
        >
          <i className="fab fa-linkedin-in"></i>
        </a>
      </div>
      <img src="images/LOGO FULL.png" alt="logo" width="240" />
    </footer>
  );
};

export default Footer;
