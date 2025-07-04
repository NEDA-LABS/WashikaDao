// Import the Link component from React Router for in-app client-side navigation.
import { Link } from "react-router";

/**
 * NavLogo Component
 *
 * This component renders the application's logo within the navigation bar.
 * It uses the Link component to wrap the logo images, enabling navigation
 * to the homepage ("/") when clicked.
 *
 * The component includes:
 * - A symbolic logo image with a fixed width.
 * - A text-based logo image styled with a specific CSS class.
 *
 * @returns {JSX.Element} The rendered navigation logo.
 */
const NavLogo = () => {
  return (
    <div className="navbar-logo">
      {/* Wrap logo images in a Link to enable navigation to the home page */}
      <Link to="/" className="logo-link">
        {/* Render the symbolic logo image with a set width for visual consistency */}
        <img
          src="/images/LOGO SYMBLO.png" // Path to the logo symbol image.
          alt="logo" // Alternative text for accessibility.
          width="24" // Specifies the width of the symbolic logo.
        />
        {/* Render the text-based logo image, styled with a dedicated CSS class */}
        <img
          src="/images/words logo.png" // Path to the word-based logo image.
          className="wordLogo" // CSS class for styling the text-based logo.
          alt="logo" // Alternative text for accessibility.
        />
      </Link>
    </div>
  );
};

// Export the NavLogo component for inclusion in the navigation bar or other areas of the application.
export default NavLogo;
