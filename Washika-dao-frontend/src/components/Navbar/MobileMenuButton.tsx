// Import necessary dependencies from FontAwesome for icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import FontAwesomeIcon component to render icons
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons"; // Import specific icons (hamburger menu and close icon)

/**
 * Interface defining the props for the `MobileMenuButton` component.
 *
 * @property {boolean} isOpen - Indicates whether the mobile menu is currently open.
 * @property {() => void} toggleMenu - A function to toggle the menu state.
 */
interface MobileMenuButtonProps {
  isOpen: boolean;
  toggleMenu: () => void;
}

/**
 * A React functional component that renders a button to toggle the mobile menu.
 *
 * @component
 * @param {MobileMenuButtonProps} props - The component props.
 * @returns {JSX.Element} The rendered button component.
 *
 * @remarks
 * - Displays a hamburger menu (`faBars`) when the menu is closed.
 * - Displays a close icon (`faTimes`) when the menu is open.
 * - Calls `toggleMenu` function when clicked to update the menu state.
 */
const MobileMenuButton: React.FC<MobileMenuButtonProps> = ({
  isOpen,
  toggleMenu,
}) => {
  return (
    <button className="menu-button" onClick={toggleMenu}>
      {/* Renders either the hamburger menu or close icon based on `isOpen` state */}
      <FontAwesomeIcon icon={isOpen ? faTimes : faBars} size="sm" />
    </button>
  );
};

// Export the component for use in other parts of the application.
export default MobileMenuButton;
