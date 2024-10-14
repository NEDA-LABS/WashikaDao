"use client";
import Link from "next/link";
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
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/washika-dao">WashikaDAO</Link>
          </li>
          <li>
            <Link href="/explore">Explore</Link>
          </li>
          <li>
            <Link href="/karibu">Karibu</Link>
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
          href="https://x.com/nedalabs?s=11&t=hj2iETJOAG45JhGdjSLNcg"
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
          href="https://linkedin.com/company/nedalabs/"
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
