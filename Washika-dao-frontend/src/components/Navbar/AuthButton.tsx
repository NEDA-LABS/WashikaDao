// Import dependencies for blockchain authentication, theming, routing, and state management.
import { ConnectButton, lightTheme } from "thirdweb/react";
import { arbitrumSepolia } from "thirdweb/chains";
import { useNavigate } from "react-router-dom";
import { createThirdwebClient } from "thirdweb";
import { useDispatch, useSelector } from "react-redux";
import { toggleNotificationPopup } from "../../redux/notifications/notificationSlice";
import { inAppWallet } from "thirdweb/wallets";
import { useEffect, useState } from "react";
import { RootState } from "../../redux/store";
import { login } from "../../redux/auth/authSlice";
import { useMemberDaos } from "./useMemberDaos";
import { useDaoNavigation } from "./useDaoNavigation";

/**
 * Creates a Thirdweb client instance used for blockchain interactions and authentication.
 *
 * @remarks
 * - Reads the client ID from an environment variable.
 * - This client instance is later passed to the ConnectButton for handling authentication.
 */
const client = createThirdwebClient({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  clientId: import.meta.env.VITE_THIRDWEB_CLIENT_ID, // Retrieve the client ID from environment variables.
});

/**
 * Interface representing the props for the AuthButton component.
 *
 * @property {string} className - A CSS class name that determines which UI element to render.
 * @property {() => void} [toggleMenu] - Optional callback to toggle the mobile menu.
 */
interface AuthButtonProps {
  className: string;
  toggleMenu?: () => void;
}

/**
 * AuthButton component manages user authentication, navigation, and role-based UI rendering.
 *
 * Behavior:
 * - Synchronizes authentication state between Redux and localStorage.
 * - Applies a custom theme to the ConnectButton.
 * - Determines available wallet authentication methods.
 * - Conditionally renders different buttons based on the user's role and current page context.
 *
 * @param {AuthButtonProps} props - Component properties.
 * @returns {JSX.Element} Rendered button(s) for authentication or navigation.
 */
const AuthButton: React.FC<AuthButtonProps> = ({ className, toggleMenu }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const address = useSelector((state: RootState) => state.auth.address);
  const firstName = useSelector((state: RootState) => state.user.firstName);
  const { daos } = useMemberDaos(address || "");

  // Synchronize Redux state with localStorage to persist the user's authentication state.
  useEffect(() => {
    const storedAddress = localStorage.getItem("address");
    if (storedAddress && storedAddress !== address) {
      dispatch(login(storedAddress));
    }
  }, [dispatch, address]);

  // Check membership existence for the logged-in user.
  const { memberExists } = useMemberDaos(address || "");

  /**
   * Define a custom theme for the ConnectButton using Thirdweb's lightTheme.
   *
   * @remarks
   * - Customizes the primary button background and text colors.
   */
  const customTheme = lightTheme({
    colors: {
      primaryButtonBg: "#d0820c", // Custom button background color.
      primaryButtonText: "#fbfaf8", // Custom button text color.
    },
  });

  /**
   * Define wallet authentication options using inAppWallet.
   *
   * @remarks
   * - Supports multiple login methods: email, Google, phone, and wallet.
   * - Configured to use a popup authentication mode for enhanced UX.
   */
  const wallets = [
    inAppWallet({
      auth: {
        mode: "popup", // Enables authentication via a popup.
        options: ["email", "google", "phone", "wallet"], // Provides multiple login options.
      },
    }),
  ];

  // Retrieve filtered DAO data and a function to navigate to a selected DAO.
  const { filteredDaos, navigateToDao } = useDaoNavigation(daos);

  // Local state to track the currently selected DAO transaction hash.
  const [selectedDaoTxHash, setSelectedDaoTxHash] = useState<string | number>(
    localStorage.getItem("selectedDaoTxHash") || ""
  );

  // If no DAO is currently selected and DAOs are available, auto-select the first DAO.
  useEffect(() => {
    if (!selectedDaoTxHash && filteredDaos.length > 0) {
      setSelectedDaoTxHash(filteredDaos[0].daoTxHash);
      localStorage.setItem("selectedDaoTxHash", filteredDaos[0].daoTxHash);
    }
  }, [filteredDaos, selectedDaoTxHash]);

  /**
   * Updates the selected DAO based on user selection from a dropdown.
   *
   * @param {React.ChangeEvent<HTMLSelectElement>} event - Event triggered on DAO selection.
   *
   * Behavior:
   * - Updates local state and localStorage with the selected DAO's transaction hash.
   * - Navigates to the corresponding DAO page using the navigateToDao function.
   */
  const handleDaoChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTxHash = event.target.value;
    setSelectedDaoTxHash(selectedTxHash);
    localStorage.setItem("selectedDaoTxHash", selectedTxHash);

    const selectedDao = filteredDaos.find(
      (dao) => dao.daoTxHash === selectedTxHash
    );
    if (selectedDao) navigateToDao(selectedDao);
  };

  /**
   * Determines if the "Member Profile" button should be shown.
   *
   * @remarks
   * - Hides the profile button for certain contexts (e.g., DAO registration, SuperAdmin view).
   */
  const shouldShowMemberProfile = ![
    "DaoProfile",
    "navbarOwner",
    "DaoRegister",
    "SuperAdmin",
    "navbarDaoMember",
    "navbarMarketPlace",
  ].includes(className);

  // Conditional rendering based on authentication and the provided className.

  // 1. Render a "Profile" or "MarketPlace" button for authenticated users in general contexts.
  if (address && shouldShowMemberProfile) {
    return memberExists ? (
      <button
        className="portalButton"
        onClick={() => navigate(`/MemberProfile/${address}`)}
      >
        Profile
      </button>
    ) : (
      <button className="portalButton" onClick={() => navigate("/MarketPlace")}>
        MarketPlace
      </button>
    );
  }

  // 2. Render a "Notifications" button for SuperAdmin users.
  if (className === "SuperAdmin") {
    return (
      <button
        className="portalButton"
        onClick={() => {
          dispatch(toggleNotificationPopup());
          // Toggle the mobile menu when notifications is clicked
          if (toggleMenu) toggleMenu();
        }}
      >
        Notifications
      </button>
    );
  }

  // 3. For the "DaoProfile" context, render a button displaying the user's first name.
  if (className === "DaoProfile") {
    return (
      <button
        className="portalButton"
        onClick={() => navigate(`/MemberProfile/${address}`)}
      >
        {firstName}
      </button>
    );
  }

  // 4. For navbarDaoMember, render a dropdown to select among available DAOs.
  if (className === "navbarDaoMember") {
    return (
      <select
        className="portalButton select"
        value={selectedDaoTxHash}
        onChange={handleDaoChange}
      >
        {filteredDaos.map((dao) => (
          <option key={dao.daoTxHash} value={dao.daoTxHash}>
            {dao.daoName}
          </option>
        ))}
        <ConnectButton
          client={client} // Thirdweb client instance.
          theme={customTheme} // Custom theme configuration.
          accountAbstraction={{ chain: arbitrumSepolia, sponsorGas: false }} // Configures account abstraction for Arbitrum Sepolia.
          wallets={wallets} // Provides authentication options.
        />
      </select>
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
