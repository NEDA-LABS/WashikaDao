import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faTwitter,
  faInstagram,
  faLinkedinIn,
} from "@fortawesome/free-brands-svg-icons";

interface FooterProps {
  className: string;
}
/**
 * Footer component that renders a footer section with useful links and social media icons.
 *
 * @param {FooterProps} props - The properties for the Footer component.
 * @param {string} props.className - A CSS class name to style the footer.
 *
 * @returns {JSX.Element} A JSX element representing the footer.
 *
 * The footer includes:
 * - A list of useful links to different sections of the website.
 * - Social media icons with links to external social media pages.
 * - A logo image displayed at the bottom of the footer.
 *
 * The social media links open in a new tab and are styled with FontAwesome icons.
 */
const Footer: React.FC<FooterProps> = ({ className }) => {
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
            <Link to="/karibu">Welcome</Link>
          </li>
        </ul>
      </div>
      <div className="social-media-icons">
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon"
        >
          <FontAwesomeIcon icon={faFacebookF} />
        </a>
        <a
          href="https://x.com/nedalabs?s=11&t=hj2iETJOAG45JhGdjSLNcg"
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon"
        >
          <FontAwesomeIcon icon={faTwitter} />
        </a>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon"
        >
          <FontAwesomeIcon icon={faInstagram} />
        </a>
        <a
          href="https://linkedin.com/company/nedalabs/"
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon"
        >
          <FontAwesomeIcon icon={faLinkedinIn} />
        </a>
      </div>
      <img src="/images/LOGO FULL.png" alt="logo" width="240" />
    </footer>
  );
};

export default Footer;
