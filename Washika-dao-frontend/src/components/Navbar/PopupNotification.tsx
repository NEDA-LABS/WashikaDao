/**
 * Interface defining the properties for the `PopupNotification` component.
 *
 * @property {boolean} showPopup - Determines whether the popup should be displayed.
 * @property {() => void} closePopup - Function to close the popup when the button is clicked.
 */
interface PopupNotificationProps {
  showPopup: boolean;
  closePopup: () => void;
}

/**
 * A React functional component that displays a popup notification.
 *
 * @component
 * @param {PopupNotificationProps} props - The component props.
 * @returns {JSX.Element | null} The rendered popup notification or null if not visible.
 *
 * @remarks
 * - Used to notify users that they need to log in to access the DAO Tool Kit.
 * - The popup is conditionally rendered based on the `showPopup` prop.
 * - Clicking the "Close" button triggers the `closePopup` function to hide the popup.
 */
const PopupNotification: React.FC<PopupNotificationProps> = ({ showPopup, closePopup }) => {
  // If showPopup is false, do not render anything (return null).
  if (!showPopup) return null;

  return (
    <div className="popup"> {/* Container for the popup */}
      <div className="popup-content"> {/* Popup content wrapper */}
        <p>Please log in to access the DAO Tool Kit.</p> {/* Notification message */}
        <button onClick={closePopup}>Close</button> {/* Button to close the popup */}
      </div>
    </div>
  );
};

// Export the component for use in other parts of the application.
export default PopupNotification;
