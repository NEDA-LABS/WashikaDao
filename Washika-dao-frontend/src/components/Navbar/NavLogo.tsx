// Import the `Link` component from React Router for client-side navigation.
import { Link } from "react-router-dom";

/**
 * `NavLogo` Component
 *
 * @component
 * @returns {JSX.Element} The navigation logo component.
 *
 * @description
 * - Displays the application's logo within the navigation bar.
 * - Uses the `Link` component for navigation to the homepage (`"/"`).
 * - Includes both a symbolic logo and a text-based logo.
 */
const NavLogo = () => {
  return (
    <div className="navbar-logo">
      {/* Navigation link to the home page */}
      <Link to="/" className="logo-link">
        {/* Symbolic logo image */}
        <img 
          src="/images/LOGO SYMBLO(1).png" // Path to the logo symbol image.
          alt="logo" // Alternative text for accessibility.
          width="24" // Sets the width of the logo.
        />
        {/* Word-based logo image */}
        <img 
          src="/images/words logo.png" // Path to the word-based logo image.
          className="wordLogo" // CSS class for styling.
          alt="logo" // Alternative text for accessibility.
        />
      </Link>
    </div>
  );
};

// Export the component for use in the navigation bar or other parts of the application.
export default NavLogo;
