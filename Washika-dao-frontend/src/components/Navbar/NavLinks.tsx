// Import necessary dependencies
import { Link } from "react-router-dom"; // Import Link for client-side navigation.
import AuthButton from "./AuthButton"; // Import the authentication button component.
import { useDaoNavigation } from "./useDaoNavigation";
import { useMemberDaos } from "./useMemberDaos";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import PopupNotification from "./PopupNotification"; // Component for displaying pop-up notifications.
import { useState } from "react";
import ReactDOM from "react-dom";

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
  toggleMenu: () => void;
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
  toggleMenu,
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

  // Use the navigation hook to filter DAOs based on the provided mode.
  const { filteredDaos, navigateToDao } = useDaoNavigation(daos);

  const handleDaoToolKitClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const selectedDaoTxHash = localStorage.getItem("selectedDaoTxHash");

    if (selectedDaoTxHash) {
      const selectedDao = filteredDaos.find(
        (dao) => dao.daoTxHash === selectedDaoTxHash
      );
      if (selectedDao) {
        navigateToDao(selectedDao);
        return;
      }
    }

    if (filteredDaos.length === 1) {
      navigateToDao(filteredDaos[0]);
    } else {
      setShowPopupNotification(true);
    }
  };

  const shouldShowRegisterDao = ![
    "CreateProposal",
    "DaoRegister",
    "SuperAdmin",
  ].includes(className);

  // Define the mobile menu content that we want to render in the portal.
  const mobileMenuContent = (
    <ul className="nav-links open">
      {shouldShowRegisterDao && (
        <li>
          <Link to="/DaoRegistration" onClick={handleRegisterDaoLink}>
            Open Dao
          </Link>
        </li>
      )}
      <li>
        <Link to="/Blogs">EducationHUB</Link>
      </li>
      {className === "DaoProfile" || className === "navbarProposal" ? (
        <li className="three">
          <Link to="/MarketPlace">MarketPlace</Link>
        </li>
      ) : className === "SuperAdmin" ? (
        <>
          <li className="three">
            <Link to={"/CreateProposal"}>Create Proposal</Link>
          </li>
          <li className="three">
            <Link to={`/Funder/${address}`}>Funder</Link>
          </li>
        </>
      ) : (
        showDaoToolKit && (
          <li className="three">
            <Link to="" onClick={handleDaoToolKitClick}>
              DAO Tool Kit
            </Link>
          </li>
        )
      )}
      <AuthButton className={className} toggleMenu={toggleMenu} />
      <PopupNotification
        showPopup={showPopupNotification}
        closePopup={() => setShowPopupNotification(false)}
      />
    </ul>
  );

  return (
    /**
     * Navigation menu container.
     *
     * @remarks
     * - Uses the `isOpen` prop to toggle the "open" class, controlling visibility.
     */
    <>
      <ul className={`nav-links ${isOpen ? "hidden" : ""}`}>
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
            <Link to={"/MarketPlace"}>MarketPlace</Link>
          </li>
        ) : className === "SuperAdmin" ? (
          /**
           * If the user is a SuperAdmin, show a "Create Proposal" link.
           */
          <>
            <li className="three">
              <Link to={"/CreateProposal"}>Create Proposal</Link>
            </li>
            <li className="three">
              <Link to={`/Funder/${address}`}>Funder</Link>
            </li>
          </>
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

        {/* Popup Notification for Users Without DAO Multi-Signature Address */}
        <PopupNotification
          showPopup={showPopupNotification}
          closePopup={() => setShowPopupNotification(false)}
        />
      </ul>
      {/* When the mobile menu is open, render it into the portal.
          This moves it outside of the navbar’s DOM so that it can appear above the daoImage. */}
      {isOpen &&
        ReactDOM.createPortal(
          mobileMenuContent,
          document.getElementById("mobile-menu-portal") as HTMLElement
        )}
    </>
  );
};

// Export the component for use in other parts of the application.
export default NavLinks;
