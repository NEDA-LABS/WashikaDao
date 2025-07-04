// Import React hooks for managing state and side effects.
import { useState } from "react";
import { useNavigate } from "react-router";
import { useActiveAccount } from "thirdweb/react";

// Import custom components for the navigation bar.
import NavLogo from "./NavLogo.js";
import MobileMenuButton from "./MobileMenuButton.js";
import NavLinks from "./NavLinks.js";

// Import actions for authentication state.

/**
 * Props interface for the NavBar component.
 *
 * @property {string} className - CSS class name(s) to apply to the nav element.
 */
interface NavBarProps {
  className: string;
}

/**
 * NavBar functional component renders the top navigation bar.
 *
 * Features:
 * - Displays the site logo, navigation links, and a mobile menu toggle button.
 * - Integrates with blockchain account authentication via Thirdweb.
 * - Synchronizes authentication state with Redux and localStorage.
 * - Redirects to the homepage if the blockchain account is disconnected.
 *
 * @param {NavBarProps} props - Component properties.
 * @returns {JSX.Element} Rendered navigation bar.
 */
const NavBar: React.FC<NavBarProps> = ({ className }): JSX.Element => {
  const navigate = useNavigate();
  const activeAccount = useActiveAccount();
  const address = activeAccount?.address;
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  const token = import.meta.env.VITE_ROUTE_PROTECTOR;
  localStorage.setItem("token", token)
  // console.log(token);

  /**
   * Handles click events on the "Register DAO" link.
   *
   * Functionality:
   * - Prevents the default behavior of the link.
   * - Checks localStorage for a stored address indicating an authenticated user.
   * - If authenticated, navigates to the DAO registration page.
   * - Otherwise, alerts the user to connect their wallet.
   *
   * @param {React.MouseEvent<HTMLAnchorElement>} e - The click event.
   */
  const handleRegisterDaoLink = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (address) {
      navigate("/DaoRegistration");
    } else {
      alert("Click on Connect to log in");
    }
  };

  return (
    <nav className={className}>
      {/* Render the site logo */}
      <NavLogo />

      {/* Render the mobile menu toggle button */}
      <MobileMenuButton
        isOpen={isMenuOpen}
        toggleMenu={() => setIsMenuOpen(!isMenuOpen)}
      />

      {/* Render the navigation links and pass down event handlers */}
      <NavLinks
        className={className}
        isOpen={isMenuOpen}
        handleRegisterDaoLink={handleRegisterDaoLink}
        toggleMenu={() => setIsMenuOpen(!isMenuOpen)}
      />
    </nav>
  );
};

// Export the NavBar component for use in other parts of the application.
export default NavBar;
