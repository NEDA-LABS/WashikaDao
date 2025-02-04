import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearCurrentUser, setCurrentUser } from "../redux/users/userSlice";
import { toggleNotificationPopup } from "../redux/notifications/notificationSlice";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { createThirdwebClient } from "thirdweb";
import { ConnectButton, useActiveAccount, lightTheme } from "thirdweb/react";
import { inAppWallet } from "thirdweb/wallets"; //Add createWallet to allow funders to use metamask to fund dao operations
import { arbitrumSepolia } from "thirdweb/chains";
import { useEffect, useRef, useState } from "react";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
const _clientId = import.meta.env.VITE_THIRDWEB_CLIENT_ID;
const client = createThirdwebClient({ clientId: _clientId });

interface NavBarProps {
  className: string;
}
/**
 * NavBar component renders a navigation bar with links and buttons for user interaction.
 * It manages user authentication state and navigation based on the active account status.
 *
 * @param {NavBarProps} props - The properties for the NavBar component.
 * @param {string} props.className - The CSS class name for styling the navigation bar.
 *
 * @returns {JSX.Element} The rendered navigation bar component.
 *
 * @remarks
 * - Utilizes `react-redux` for state management and `react-router-dom` for navigation.
 * - Integrates with `thirdweb` for blockchain wallet connections and account management.
 * - Handles user login/logout and displays appropriate navigation options based on user role.
 * - Displays a popup if the user attempts to access restricted areas without logging in.
 *
 * @example
 * <NavBar className="navbarOwner" />
 *
 * @see {@link https://react-redux.js.org/} for more on react-redux.
 * @see {@link https://reactrouter.com/} for more on react-router-dom.
 * @see {@link https://portal.thirdweb.com/} for more on thirdweb integration.
 */
const NavBar: React.FC<NavBarProps> = ({ className }: NavBarProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const activeAccount = useActiveAccount();
  const [address, setAddress] = useState<string | null>(null);
  const hasLoggedIn = useRef(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const { role, daoMultiSig } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    // Save active account to localStorage
    if (activeAccount?.address) {
      localStorage.setItem(
        "activeAccount",
        activeAccount.address.toLowerCase()
      );
    }
  }, [activeAccount]);

  useEffect(() => {
    // Restore active account from localStorage on mount
    const savedAddress = localStorage.getItem("activeAccount");
    if (savedAddress) {
      setAddress(savedAddress);
    }
  }, []);

  const logout = () => {
    hasLoggedIn.current = false;
    localStorage.removeItem("activeAccount");
    localStorage.removeItem("token");
    dispatch(clearCurrentUser());
    navigate("/", { replace: true });
  };

  const handleNotificationClick = () => {
    dispatch(toggleNotificationPopup()); // Dispatch action to toggle popup
  };

  useEffect(() => {
    if (!activeAccount?.address && hasLoggedIn.current == true) {
      logout();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeAccount, dispatch, navigate]);

  const wallets = [
    inAppWallet({
      auth: {
        mode: "popup", //options are "popup" | "redirect" | "window"
        options: ["email", "google", "phone", "wallet"], //["discord", "google", "apple", "email", "phone", "farcaster"]
        // redirectUrl: urlToRedirectTo,
      },
    }),
  ];
  const customTheme = lightTheme({
    colors: {
      primaryButtonBg: "#d0820c", // Background color for the button
      primaryButtonText: "#fbfaf8", // Text color for the button
    },
  });
  //TODO: switch to celoAlfajoresTestnet when in prod and mainnet when deployed
  const currInUseChain = arbitrumSepolia;

  // Automatically trigger login when the wallet is connected
  useEffect(() => {
    const loginMember = async (address: string) => {
      try {
        const response = await fetch(
          "http://localhost:8080/JiungeNaDao/DaoDetails/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ memberAddr: address.toLowerCase() }),
          }
        );

        const result = await response.json();
        if (response.ok) {
          console.log("Login successful:", result.member);
          console.log("This is the token:", result.token);
          localStorage.setItem("token", result.token);
          // console.log(role);

          dispatch(
            setCurrentUser({
              memberAddr: result.member.memberAddr,
              daoMultiSig: result.member.daoMultiSig || "",
              firstName: result.member.firstName,
              lastName: result.member.lastName,
              email: result.member.email,
              role: result.member.memberRole,
              phoneNumber: result.member.phoneNumber,
              nationalIdNo: result.member.nationalIdNo,
            })
          );
          hasLoggedIn.current = true;
        } else {
          console.error("Login failed:", result.error);
          navigate("/JoinPlatform", { state: { address } });
        }
      } catch (error) {
        console.error("Login request failed:", error);
      }
    };

    if (activeAccount?.address && !hasLoggedIn.current) {
      loginMember(activeAccount.address.toLowerCase());
    }
  }, [activeAccount?.address, dispatch, navigate, role]);

  console.log("The address is", address);

  function handleRegisterDaoLink(e: React.MouseEvent) {
    e.preventDefault();
    if (address && hasLoggedIn.current == true) {
      navigate("/DaoRegistration");
    } else if (hasLoggedIn.current == false) {
      window.alert("Click on Connect to log in or create account first");
    }
    // else {
    //   console.warn("Invalid operation attempted");
    // }
  }

  const handleDaoToolKitClick = (e: React.MouseEvent) => {
    if (activeAccount?.address && hasLoggedIn.current == false) {
      e.preventDefault();
      navigate("/JoinPlatform", { state: { address } });
    } else if (!activeAccount?.address) {
      e.preventDefault();
      setShowPopup(true);
    } else if (activeAccount?.address && role === "Chairperson") {
      e.preventDefault();
      navigate(`/SuperAdmin/${daoMultiSig}`);
    }
  };

  const closePopup = () => setShowPopup(false);

  const renderRegisterDao = () => {
    if (className === "navbarFunder") {
      return;
    } else if (
      className === "CreateProposal" ||
      className === "DaoRegister" ||
      className === "SuperAdmin"
    ) {
      return;
    } else {
      return (
        <li>
          <Link to="/DaoRegistration" onClick={handleRegisterDaoLink}>
            Open Dao
          </Link>
        </li>
      );
    }
  };

  const renderProfileLink = () => {
    if (className === "DaoProfile" || className === "navbarProposal") {
      return (
        <li className="three">
          <Link to={`/Funder/${daoMultiSig}`}>FUNDER</Link>
        </li>
      );
    } else if (className === "SuperAdmin") {
      return (
        <li className="three">
          <Link to={`/CreateProposal/${daoMultiSig || ""}`}>
            Create Proposal
          </Link>
        </li>
      );
    } else {
      return (
        <li className="three">
          <Link
            to={`/DaoProfile/${daoMultiSig || ""}`}
            onClick={handleDaoToolKitClick}
          >
            DAO Tool Kit
          </Link>
        </li>
      );
    }
  };

  const renderButton = () => {
    if (
      activeAccount?.address &&
      className !== "DaoProfile" &&
      className !== "navbarOwner" &&
      className !== "joinPlatformNav" &&
      className !== "SuperAdmin"
    ) {
      // Determine the navigation path based on the role
      const getNavigationPath = () => {
        if (activeAccount.address && role === "Funder") {
          return `/Funder/${activeAccount?.address}`;
        } else if (
          (activeAccount.address && role === "Chairperson") ||
          role === "Member"
        ) {
          return `/Owner/${activeAccount?.address}`;
        } else {
          console.warn(`Unknown role: ${role}`);
          return "/"; // Default or fallback path
        }
      };

      return (
        <button onClick={() => navigate(getNavigationPath())}>Profile</button>
      );
    } else if (className === "SuperAdmin") {
      return <button onClick={handleNotificationClick}>Notifications</button>;
    } else {
      return (
        <ConnectButton
          client={client}
          theme={customTheme}
          accountAbstraction={{
            chain: currInUseChain,
            sponsorGas: false,
          }}
          wallets={wallets}
        />
      );
    }
  };

  return (
    <nav className={className}>
      <div>
        <img src="/images/LOGO SYMBLO(1).png" alt="logo" width="24" />
        <Link to="/">
          <img src="/images/words logo.png" className="wordLogo" alt="logo" />
        </Link>
      </div>

      {/* Mobile Menu Toggle Button */}
      {className === "DaoProfile" ? (
        <button onClick={() => navigate(`/Owner/${address}`)} className="menu-button">UserName</button>
      ) : className !== "SuperAdmin" ? (
        <button className="menu-button" onClick={() => setIsMenuOpen(true)}>
          <FontAwesomeIcon icon={faBars} size="sm" />
        </button>
      ) : (
        <button className="menu-button" onClick={handleNotificationClick}>
          Notifications
        </button>
      )}

      <ul className={`nav-links ${isMenuOpen ? "open" : ""}`}>
        <button className="menu-button" onClick={() => setIsMenuOpen(false)}>
          <FontAwesomeIcon icon={faTimes} size="sm" />
        </button>
        {renderRegisterDao()}
        <li>
          <Link to="/Blogs">EducationHUB</Link>
        </li>
        {renderProfileLink()}
        {showPopup && (
          <div className="popup">
            <div className="popup-content">
              <p>Please log in to access the DAO Tool Kit.</p>
              <button onClick={closePopup}>Close</button>
            </div>
          </div>
        )}
        <li className="show">{renderButton()}</li>
      </ul>
    </nav>
  );
};

export default NavBar;
