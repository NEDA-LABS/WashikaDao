// Import necessary dependencies from thirdweb, React, Redux, and React Router
import { ConnectButton, lightTheme } from "thirdweb/react"; // Import the ConnectButton for authentication and lightTheme for theming.
import { arbitrumSepolia } from "thirdweb/chains"; // Import the Arbitrum Sepolia testnet configuration.
import { useNavigate } from "react-router-dom"; // Import useNavigate for programmatic navigation.
import { createThirdwebClient } from "thirdweb"; // Import the function to create a Thirdweb client.
import { useDispatch, useSelector } from "react-redux"; // Import useDispatch to dispatch actions in Redux.
import { toggleNotificationPopup } from "../../redux/notifications/notificationSlice"; // Import the Redux action to toggle the notification popup.
import { inAppWallet } from "thirdweb/wallets"; // Import Account type and inAppWallet for authentication methods.
import { useEffect } from "react";
import { RootState } from "../../redux/store";
import { login } from "../../redux/auth/authSlice";
import {useMemberDaos} from "./useMemberDaos";

/**
 * Creates a Thirdweb client instance for handling authentication and blockchain interactions.
 *
 * @remarks
 * - Uses an environment variable for the client ID.
 * - This client is passed to the `ConnectButton` for authentication.
 */
const client = createThirdwebClient({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  clientId: import.meta.env.VITE_THIRDWEB_CLIENT_ID, // Fetches the client ID from environment variables
});

/**
 * Interface defining the properties for the `AuthButton` component.
 *
 * @property {string} className - A class name used for conditional rendering.
 */
interface AuthButtonProps {
  className: string;
  toggleMenu?: () => void;
}

/**
 * A React functional component that handles authentication, navigation, and role-based UI rendering.
 *
 * @component
 * @param {AuthButtonProps} props - The component props.
 * @returns {JSX.Element} The rendered authentication button or relevant UI elements.
 *
 * @remarks
 * - Uses `thirdweb` to authenticate users with multiple options (email, Google, phone, wallet).
 * - Redirects authenticated users to their profile page.
 * - Shows a "Notifications" button for `SuperAdmin` users.
 * - Displays a "Connect" button when the user is not authenticated.
 * - Utilizes Redux to toggle the notification popup for `SuperAdmin`.
 */
const AuthButton: React.FC<AuthButtonProps> = ({ className, toggleMenu }) => {
  const navigate = useNavigate(); // Hook for navigating between pages.
  const dispatch = useDispatch(); // Hook for dispatching Redux actions.
  const address = useSelector((state: RootState) => state.auth.address); // Get the logged-in address from Redux.


  // Sync Redux state with localStorage on load.
  useEffect(() => {
    const storedAddress = localStorage.getItem("address");
    if (storedAddress && storedAddress !== address) {
      dispatch(login(storedAddress));
    }
  }, [dispatch, address]);

  const { memberExists } = useMemberDaos(address || "");


  /**
   * Custom theme configuration for the `ConnectButton`.
   *
   * @remarks
   * - Changes the primary button's background and text colors.
   */
  const customTheme = lightTheme({
    colors: {
      primaryButtonBg: "#d0820c", // Custom button background color.
      primaryButtonText: "#fbfaf8", // Custom button text color.
    },
  });

  /**
   * Wallet authentication options available in the app.
   *
   * @remarks
   * - Users can log in via email, Google, phone, or a wallet.
   * - Uses a popup authentication mode for a better user experience.
   */
  const wallets = [
    inAppWallet({
      auth: {
        mode: "popup", // Enables authentication via a popup.
        options: ["email", "google", "phone", "wallet"], // Provides multiple login options.
      },
    }),
  ];

   // If className is "navbarFunder", render ConnectButton instead of Browse.
   if (className === "navbarFunder") {
    return (
      <ConnectButton
        client={client}
        theme={customTheme}
        accountAbstraction={{ chain: arbitrumSepolia, sponsorGas: false }}
        wallets={wallets}
      />
    );
  }

  /**
   * Determines whether to show the "Member Profile" button based on the user's role.
   *
   * @remarks
   * - If `className` belongs to certain predefined roles, the profile button is hidden.
   */
  const shouldShowMemberProfile = ![
    "DaoProfile",
    "navbarOwner",
    "joinPlatformNav",
    "SuperAdmin",
    "navbarDaoMember",
  ].includes(className);

  /**
   * Renders the "Profile" button if the user is authenticated and eligible to see it.
   *
   * @returns {JSX.Element} Profile button if conditions are met.
   */
  // decide which button to display based on whether the member exists in the backend.
  if (address && shouldShowMemberProfile) {
    return memberExists ? (
      <button className="portalButton" onClick={() => navigate(`/MemberProfile/${address}`)}>
        Profile
      </button>
    ) : (
      <button className="portalButton" onClick={() => navigate("/MarketPlace")}>
        MarketPlace
      </button>
    );
  }

  /**
   * Renders a "Notifications" button for `SuperAdmin` users.
   *
   * @returns {JSX.Element} Notifications button if the user is a SuperAdmin.
   */
  if (className === "SuperAdmin") {
    return (
      <button className="portalButton" onClick={() => {
        dispatch(toggleNotificationPopup());
        // Toggle the mobile menu when notifications is clicked
        if (toggleMenu) toggleMenu();
      }}>
        Notifications
      </button>
    );
  }

  /**
   * Renders the `ConnectButton` for users who are not yet authenticated.
   *
   * @returns {JSX.Element} The `ConnectButton` component.
   */
  return (
    <ConnectButton
      client={client} // Thirdweb client instance.
      theme={customTheme} // Custom theme configuration.
      accountAbstraction={{ chain: arbitrumSepolia, sponsorGas: false }} // Configures account abstraction for Arbitrum Sepolia.
      wallets={wallets} // Provides authentication options.
    />
  );
};

// Export the component for use in other parts of the application.
export default AuthButton;
