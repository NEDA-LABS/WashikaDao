// Import necessary dependencies
import { Link } from "react-router-dom"; // Import Link for client-side navigation.
import AuthButton from "./AuthButton"; // Import the authentication button component.
import { Account } from "thirdweb/wallets"; // Import the Account type from thirdweb.

/**
 * Interface defining the props for the `NavLinks` component.
 *
 * @property {string} className - The current component class name used for conditional rendering.
 * @property {string | null} daoMultiSigAddr - The DAO multi-signature wallet address, or null if not available.
 * @property {boolean} isOpen - Indicates whether the navigation menu is open.
 * @property {Account | undefined} activeAccount - The currently active user account, which may be undefined if not connected.
 * @property {(e: React.MouseEvent<HTMLAnchorElement>) => void} handleDaoToolKitClick - Function to handle clicks on the "DAO Tool Kit" link.
 * @property {(e: React.MouseEvent<HTMLAnchorElement>) => void} handleRegisterDaoLink - Function to handle clicks on the "Open Dao" link.
 */
interface NavLinksProps {
  className: string;
  daoMultiSigAddr: string | null;
  isOpen: boolean;
  activeAccount: Account | undefined;
  handleDaoToolKitClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  handleRegisterDaoLink: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

/**
 * `NavLinks` component - Renders a navigation menu with dynamic links based on user roles and permissions.
 *
 * @component
 * @param {NavLinksProps} props - The component props.
 * @returns {JSX.Element} The rendered navigation menu.
 *
 * @remarks
 * - Dynamically shows or hides the "Open Dao" link based on `className`.
 * - Displays different navigation links depending on the user role.
 * - Uses `AuthButton` to handle authentication and user session management.
 */
const NavLinks: React.FC<NavLinksProps> = ({
  className,
  daoMultiSigAddr,
  isOpen,
  activeAccount,
  handleDaoToolKitClick,
  handleRegisterDaoLink,
}) => {
  /**
   * Determines whether the "Open Dao" link should be shown.
   *
   * @remarks
   * - If `className` is in the list of restricted views, the link is hidden.
   */
  const shouldShowRegisterDao = ![
    "navbarFunder",
    "CreateProposal",
    "DaoRegister",
    "SuperAdmin",
  ].includes(className);

  return (
    /**
     * Navigation menu container.
     *
     * @remarks
     * - Uses the `isOpen` prop to toggle the "open" class, controlling visibility.
     */
    <ul className={`nav-links ${isOpen ? "open" : ""}`}>
      {/* Conditionally render "Open Dao" link if the navbar classnames allows it */}
      {shouldShowRegisterDao && (
        <li>
          <Link to="/DaoRegistration" onClick={handleRegisterDaoLink}>
            Open Dao
          </Link>
        </li>
      )}

      {/* Static link to the Education Hub */}
      <li>
        <Link to="/Blogs">EducationHUB</Link>
      </li>

      {/* Conditional rendering of different navigation links based on navbar classnames */}
      {className === "DaoProfile" || className === "navbarProposal" ? (
        /**
         * If the user is viewing a DAO profile or proposal-related page,
         * show the "FUNDER" link that redirects to the Funder page.
         */
        <li className="three">
          <Link to={`/Funder/${daoMultiSigAddr}`}>FUNDER</Link>
        </li>
      ) : className === "SuperAdmin" ? (
        /**
         * If the user is a SuperAdmin, show a "Create Proposal" link.
         */
        <li className="three">
          <Link to={`/CreateProposal/${daoMultiSigAddr || ""}`}>
            Create Proposal
          </Link>
        </li>
      ) : (
        /**
         * For all other users, show the "DAO Tool Kit" link.
         * - Calls `handleDaoToolKitClick` when clicked.
         */
        <li className="three">
          <Link
            to={`/DaoProfile/${daoMultiSigAddr || ""}`}
            onClick={handleDaoToolKitClick}
          >
            DAO Tool Kit
          </Link>
        </li>
      )}

      {/* Authentication button, which handles login and profile navigation */}
      <AuthButton className={className} activeAccount={activeAccount} />
    </ul>
  );
};

// Export the component for use in other parts of the application.
export default NavLinks;
