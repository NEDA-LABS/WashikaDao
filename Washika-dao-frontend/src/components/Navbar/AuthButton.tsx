// Import dependencies for blockchain authentication, theming, routing, and state management.
import { ConnectButton, lightTheme, useActiveAccount } from "thirdweb/react";
import { celoAlfajoresTestnet } from "thirdweb/chains";
import { useNavigate } from "react-router";
import { createWallet, inAppWallet } from "thirdweb/wallets";
import { useEffect, useState } from "react";
import { useMemberDaos } from "./useMemberDaos.js";
import { useDaoNavigation } from "./useDaoNavigation.js";
import { client } from "../../utils/thirdwebClient.js";

/**
 * Creates a Thirdweb client instance used for blockchain interactions and authentication.
 *
 * @remarks
 * - Reads the client ID from an environment variable.
 * - This client instance is later passed to the ConnectButton for handling authentication.
 */


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
const AuthButton: React.FC<AuthButtonProps> = ({ className }) => {
  const navigate = useNavigate();
  const activeAccount = useActiveAccount();
    const address = activeAccount?.address;
    const { daos, memberExists } = useMemberDaos(address || "");

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
        options: ["email", "google", "phone", "passkey", "facebook", "apple", "wallet"], // Provides multiple login options.
      },
    }),
    createWallet("io.metamask"),
    createWallet("com.coinbase.wallet"),
  ];

  // Retrieve filtered DAO data and a function to navigate to a selected DAO.
  const { filteredDaos, navigateToDao } = useDaoNavigation(daos);
  // Local state to track the currently selected DAO ID.
  const [selectedDaoId, setSelectedDaoId] = useState<string | number>(
    localStorage.getItem("selectedDaoId") || ""
  );

  // If no DAO is currently selected and DAOs are available, auto-select the first DAO.
  useEffect(() => {
    if (!selectedDaoId && filteredDaos.length > 0) {
      setSelectedDaoId(filteredDaos[0].daoId);
      localStorage.setItem("selectedDaoId", filteredDaos[0].daoId);
    }
  }, [filteredDaos, selectedDaoId]);

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
    const selectedDaoId = event.target.value;
    setSelectedDaoId(selectedDaoId);
    localStorage.setItem("selectedDaoId", selectedDaoId);

    const selectedDao = filteredDaos.find(
      (dao) => dao.daoId === selectedDaoId
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
  // if (className === "SuperAdmin") {
  //   return (
  //     <button
  //       className="portalButton"
  //       onClick={() => {
  //         dispatch(toggleNotificationPopup());
  //         // Toggle the mobile menu when notifications is clicked
  //         if (toggleMenu) toggleMenu();
  //       }}
  //     >
  //       Notifications
  //     </button>
  //   );
  // }

  // 4. For navbarDaoMember, render a dropdown to select among available DAOs.
  if (className === "navbarDaoMember") {
    return (
      <select
        className="portalButton select"
        value={selectedDaoId}
        onChange={handleDaoChange}
      >
        {filteredDaos.map((dao) => (
          <option key={dao.daoId} value={dao.daoId}>
            {dao.daoName}
          </option>
        ))}
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
      accountAbstraction={{ chain: celoAlfajoresTestnet, sponsorGas: false }} // Configures account abstraction for Arbitrum Sepolia.
      wallets={wallets} // Provides authentication options.
    />
  );
};

// Export the component for use in other parts of the application.
export default AuthButton;
