// Import necessary dependencies
import { Link } from "react-router-dom"; // Import Link for client-side navigation.
import AuthButton from "./AuthButton"; // Import the authentication button component.
import { Dao, DaoRoleEnum } from "../../utils/Types";
import { NavigationMode, useDaoNavigation } from "./useDaoNavigation";
import { useMemberDaos } from "./useMemberDaos";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import PopupNotification from "./PopupNotification"; // Component for displaying pop-up notifications.
import { useState } from "react";
import DaoSelectionPopup from "./DaoSelectionPopup";

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
  isOpen: boolean;
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
  isOpen,
  handleRegisterDaoLink,
}) => {
  /**
   * Determines whether the "Open Dao" link should be shown.
   *
   * @remarks
   * - If `className` is in the list of restricted views, the link is hidden.
   */
  const address = useSelector((state: RootState) => state.auth.address);
  // Fetch DAOs for the current member using the custom hook.
  const { daos } = useMemberDaos(address || "");
  // If no DAOs were found, we'll hide the DAO Tool Kit link.
  const showDaoToolKit = daos && daos.length > 0;

  // State to control the visibility of a pop-up notification.
  const [showPopupNotification, setShowPopupNotification] =
    useState<boolean>(false);
    const [showDaoPopup, setShowDaoPopup] = useState(false);

  // Helper: Compute the navigation mode based on fetched DAOs.
  const computeNavigationMode = (daos: Dao[]): NavigationMode => {
    // Check if any DAO has an admin role.
    const adminExists = daos.some(
      (dao) =>
        dao.role &&
        (dao.role === DaoRoleEnum.CHAIRPERSON ||
          dao.role === DaoRoleEnum.TREASURER ||
          dao.role === DaoRoleEnum.SECRETARY)
    );
    return adminExists ? "admin" : "member";
  };

  // Compute mode from the fetched DAOs.
  const computedMode = computeNavigationMode(daos);

  // Use the navigation hook to filter DAOs based on the provided mode.
  const { filteredDaos, navigateToDao } = useDaoNavigation(
    daos,
    computedMode
  );

  // Handler for the "DAO Tool Kit" link.
  const handleDaoToolKitClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (filteredDaos.length === 1) {
      // If exactly one DAO qualifies, navigate immediately.

      navigateToDao(filteredDaos[0]);
    } else if (filteredDaos.length > 1) {
      setShowDaoPopup(true);
    } else {
      // If no matching DAO is found, show a notification.
      setShowPopupNotification(true);
    }
  };

  const shouldShowRegisterDao = ![
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

      {/* Conditional rendering of different navigation links based on dao multiSigAddr */}
      {className === "DaoProfile" || className === "navbarProposal" ? (
        /**
         * If the user is viewing a DAO profile or proposal-related page,
         * show the "FUNDER" link that redirects to the Funder page.
         */
        <li className="three">
          <Link to={"/Browse"}>Browse</Link>
        </li>
      ) : className === "SuperAdmin" ? (
        /**
         * If the user is a SuperAdmin, show a "Create Proposal" link.
         */
        <li className="three">
          <Link to={"/CreateProposal"}>Create Proposal</Link>
        </li>
      ) : (
        /**
         * For all other users, show the "DAO Tool Kit" link.
         * - Calls `handleDaoToolKitClick` when clicked.
         */
        showDaoToolKit && (
          <li className="three">
            <Link to="" onClick={handleDaoToolKitClick}>
              DAO Tool Kit
            </Link>
          </li>
        )
      )}

      {/* Authentication button, which handles login and profile navigation */}
      <AuthButton className={className} />

      {showDaoPopup && (
        <DaoSelectionPopup
          daos={filteredDaos}
          onSelect={(dao: Dao) => {
            navigateToDao(dao);
            setShowDaoPopup(false);
          }}
          onClose={() => setShowDaoPopup(false)}
        />
      )}

      {/* Popup Notification for Users Without DAO Multi-Signature Address */}
      <PopupNotification
        showPopup={showPopupNotification}
        closePopup={() => setShowPopupNotification(false)}
      />
    </ul>
  );
};

// Export the component for use in other parts of the application.
export default NavLinks;
