// Import necessary dependencies from React, React Router, and Thirdweb
import { useState, useEffect } from "react"; // React hooks for state and side effects.
import { useNavigate } from "react-router-dom"; // Hook for programmatic navigation.
import { useActiveAccount } from "thirdweb/react"; // Hook for fetching the currently active blockchain account.

// Import custom components for the navigation bar.
import NavLogo from "./NavLogo"; // Logo component for the navigation bar.
import MobileMenuButton from "./MobileMenuButton"; // Component for toggling the mobile menu.
import NavLinks from "./NavLinks"; // Component containing navigation links.
import PopupNotification from "./PopupNotification"; // Component for displaying pop-up notifications.
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { login, logout } from "../../redux/auth/authSlice";
import useDaoNavigation, { NavigationMode } from "./useDaoNavigation";
import useMemberDaos from "./useMemberDaos";
import DaoSelectionPopup from "./DaoSelectionPopup";
import { Dao, DaoRoleEnum } from "../../utils/Types";

/**
 * Interface defining the props for the `NavBar` component.
 *
 * @property {string} className - The CSS class name applied to the navbar.
 */
interface NavBarProps {
  className: string;
}

/**
 * A React functional component that renders the navigation bar.
 *
 * @component
 * @param {NavBarProps} props - The component props.
 * @returns {JSX.Element} The rendered navigation bar.
 *
 * @remarks
 * - Displays navigation links, a mobile menu button, and a logo.
 * - Checks for an active blockchain account and handles login persistence.
 * - Redirects the user to the homepage if no account is found.
 * - Manages user authentication state in `localStorage`.
 */
const NavBar: React.FC<NavBarProps> = ({
  className,
}): JSX.Element => {
  const navigate = useNavigate(); // Hook for navigation.
  const dispatch = useDispatch();
  const activeAccount = useActiveAccount(); // Retrieves the currently active blockchain account.
  const address = useSelector((state: RootState) => state.auth.address);
  // State to manage the mobile menu's open/close status.
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  // State to control the visibility of a pop-up notification.
  const [showPopupNotification, setShowPopupNotification] =
    useState<boolean>(false);

  // We'll store the currently selected DAO's multiSigAddr.
  const [currentDaoMultiSigAddr, setCurrentDaoMultiSigAddr] = useState<
    string | null
  >(null);

  /**
   * Effect: Store the active account address in `localStorage` when it changes.
   *
   * @remarks
   * - Converts the address to lowercase before storing for consistency.
   */
  useEffect(() => {
    if (activeAccount?.address) {
      const lowerCaseAddress = activeAccount.address.toLowerCase();
      if (lowerCaseAddress !== address) {
        dispatch(login(lowerCaseAddress));
      }
    } else if (address) {
      dispatch(logout());
      navigate("/", { replace: true });
    }
  }, [activeAccount, address, dispatch, navigate]);

  // Fetch DAOs for the current member using the custom hook.
  const { daos } = useMemberDaos(address || "");

  // If no DAOs were found, we'll hide the DAO Tool Kit link.
  const showDaoToolKit = daos && daos.length > 0;

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
  const { showPopup, filteredDaos, navigateToDao } = useDaoNavigation(
    daos,
    computedMode
  );

  // When filteredDaos changes, if there's exactly one DAO and no current selection, set it.
  useEffect(() => {
    if (filteredDaos.length === 1 && !currentDaoMultiSigAddr) {
      setCurrentDaoMultiSigAddr(filteredDaos[0].daoMultiSigAddr);
    }
  }, [filteredDaos, currentDaoMultiSigAddr]);

  // Handler for DAO selection from the popup.
  const handleDaoSelection = (dao: Dao) => {
    setCurrentDaoMultiSigAddr(dao.daoMultiSigAddr);
    navigateToDao(dao);
  };

  /**
   * Handles clicks on the "Register DAO" link.
   *
   * @param {React.MouseEvent<HTMLAnchorElement>} e - The event object.
   *
   * @remarks
   * - Prevents default navigation.
   * - Redirects the user to the DAO registration page if they are logged in.
   * - Shows an alert if the user is not logged in.
   */
  const handleRegisterDaoLink = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const storedAddress = localStorage.getItem("address");
    if (storedAddress) {
      navigate("/DaoRegistration");
    } else {
      alert("Click on Connect to log in");
    }
  };

  /**
   * Handles clicks on the "DAO Toolkit" link.
   *
   * @param {React.MouseEvent<HTMLAnchorElement>} e - The event object.
   *
   * @remarks
   * - Prevents default navigation if no `daoMultiSigAddr` exists.
   * - Shows a pop-up notification instead.
   * - Navigates to the SuperAdmin dashboard if an address is available.
   */
    // Handler for the "DAO Tool Kit" link.
    const handleDaoToolKitClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      if (filteredDaos.length === 1) {
        // If exactly one DAO qualifies, navigate immediately.
        navigateToDao(filteredDaos[0]);
      } else if (filteredDaos.length > 1) {
        // If multiple DAOs qualify, the popup will be shown via the hook.
        // (You can optionally add additional logic here if needed.)
      } else {
        // If no matching DAO is found, show a notification.
        setShowPopupNotification(true);
      }
    };
  

  return (
    <nav className={className}>
      {/* Logo Component */}
      <NavLogo />

      {/* Mobile Menu Toggle Button */}
      <MobileMenuButton
        isOpen={isMenuOpen}
        toggleMenu={() => setIsMenuOpen(!isMenuOpen)}
      />

      {/* Navigation Links */}
      <NavLinks
        className={className}
        isOpen={isMenuOpen}
        handleRegisterDaoLink={handleRegisterDaoLink} // Click handler for the DAO registration link.
        handleDaoToolKitClick={handleDaoToolKitClick}
        showDaoToolKit={showDaoToolKit}
      />

      {/* Popup Notification for Users Without DAO Multi-Signature Address */}
      <PopupNotification
        showPopup={showPopupNotification}
        closePopup={() => setShowPopupNotification(false)}
      />

      {showPopup && (
        <DaoSelectionPopup
          daos={filteredDaos}
          onSelect={handleDaoSelection}
          onClose={() => {}}
        />
      )}
    </nav>
  );
};

// Export the NavBar component for use in other parts of the application.
export default NavBar;
