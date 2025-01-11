//import { useDispatch } from "react-redux";
import { Link,useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
//import { RootState } from "../redux/store";
import { createThirdwebClient } from "thirdweb";
import { ConnectButton, useActiveAccount, lightTheme } from "thirdweb/react";
import { inAppWallet } from "thirdweb/wallets";
import { arbitrumSepolia } from "thirdweb/chains";
import { useEffect,  useState } from "react";
//import DaoRegistration from "../pages/DaoRegistration";

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
const NavBar: React.FC<NavBarProps> = ({ className }) => {
  //const dispatch = useDispatch();
  const navigate = useNavigate();
 // const location = useLocation();
  const activeAccount = useActiveAccount();
  const address = GetActiveAccount();
  // const urlToRedirectTo = `http://localhost:5173/Owner/${address?.toLowerCase()}`;

  const [showPopup, setShowPopup] = useState(false);
  const { role } = useSelector((state: any) => state.user);

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  type CustomErrorMessages = Error;
  type ActiveAccRetType = string | undefined;

  function GetActiveAccount(): ActiveAccRetType | CustomErrorMessages {
    if (activeAccount?.address) {
      console.log("The account details are", activeAccount);
      console.log("Active Account Address:", activeAccount.address);
      return activeAccount.address.toLowerCase(); // Return the address
    } else if (activeAccount === undefined) {
      console.log("Undefined value for the active account, try connecting to a wallet")
      return undefined;
    } else {
    console.error("Error Getting Active account");
    const _customErrMessage: CustomErrorMessages = Error("operationalError");
    return _customErrMessage;
  }
  }

  function handleUserLogin(): void{
    const userAcc = GetActiveAccount();
    //check if user is an instance of CustomErrorMessages
    if (userAcc instanceof Error || userAcc === undefined) {
      console.log("FAILED, please retry operation")//TODO: add better way to inform user of failed login
      setIsLoggedIn(false);
    } else {
      setIsLoggedIn(true);
    }

  }

  const wallets = [
    inAppWallet({
      auth: {
        mode: "popup", //options are "popup" | "redirect" | "window"
        options: ["email", "google", "phone"], //["discord", "google", "apple", "email", "phone", "farcaster"]
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
          console.log("Login successful:", result.message);
          console.log(role);
          
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
  }, [activeAccount, dispatch, location, navigate, role]);

  handleUserLogin()


  }, [activeAccount, isLoggedIn]);

  function handleRegisterDaoLink(e: React.MouseEvent): void {
    e.preventDefault();
    if(isLoggedIn === true) {
      navigate("DaoRegistration")
    } else if (isLoggedIn === false) {
      window.alert("Click on Connect to log in or create account first");
    } else {
      console.warn("Invalid operation attempted");
    }
  }

  const daoMultiSig = typeof address === 'string' ? address.toLowerCase() : undefined;

  const handleDaoToolKitClick = (e: React.MouseEvent) => {
    if (address && !isLoggedIn) {
      e.preventDefault();
      navigate("/JoinPlatform", { state: { address } });
    } else if (!address) {
      e.preventDefault();
      setShowPopup(true);
    }
  };

  const closePopup = () => setShowPopup(false);

  const renderProfileLink = () => {
    if (className === "DaoProfile" || className === "navbarProposal") {
      return (
        <li className="three">
          <Link to="/funder">FUNDERS</Link>
        </li>
      );
    } else {
      return (
        <li className="three">
          <Link
            to={`/DaoProfile/${daoMultiSig?.toLowerCase() || ""}`}
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
      address &&
      className !== "DaoProfile" &&
      className !== "navbarOwner" &&
      className !== "joinPlatformNav"
    ) {
      // Determine the navigation path based on the role
      const getNavigationPath = () => {
        if (role === "Funder") {
          return `/Funder/${address.toLowerCase()}`;
        } else if (role === "Chairperson") {
          return `/SuperAdmin/${address.toLowerCase()}`;
        } else if (role === "Member") {
          return `/Owner/${address.toLowerCase()}`;
        } else {
          console.warn(`Unknown role: ${role}`);
          return "/"; // Default or fallback path
        }
      };
  
      return (

        <button onClick={() => navigate(getNavigationPath())}>
        <button
          onClick={() =>
            navigate(
              role === "Chairperson" || role === "Member"
                ? `/Owner/${typeof address === 'string' ? address.toLowerCase() : ''}`
                : `/Funder/${typeof address === 'string' ? address.toLowerCase() : ''}`
            )
          }
        >
          Profile
        </button>
      );
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
      <ul>
        <li>
          <Link
          to="/DaoRegistration"
          onClick={handleRegisterDaoLink}
          >Create Dao</Link>
        </li>
        <li>
          <Link to="/JifunzeElimu">Education/Blogs</Link>
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
