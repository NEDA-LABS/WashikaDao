import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { clearCurrentUser, setCurrentUser } from "../redux/users/userSlice";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { createThirdwebClient } from "thirdweb";
import { ConnectButton, useActiveAccount, lightTheme } from "thirdweb/react";
import { inAppWallet } from "thirdweb/wallets";
import { arbitrumSepolia } from "thirdweb/chains";
import { useEffect, useRef, useState } from "react";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
const _clientId = import.meta.env.VITE_THIRDWEB_CLIENT_ID;
const client = createThirdwebClient({ clientId: _clientId });

interface NavBarProps {
  className: string;
}

const NavBar: React.FC<NavBarProps> = ({ className }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const activeAccount = useActiveAccount();
  const address = handleGetActiveAccount();
  // const urlToRedirectTo = `http://localhost:5173/Owner/${address?.toLowerCase()}`;
  const hasLoggedIn = useRef(false);
  const [showPopup, setShowPopup] = useState(false);
  const { role } = useSelector((state: RootState) => state.user);

  function handleGetActiveAccount(): string | undefined {
    if (activeAccount?.address) {
      console.log("The account details are", activeAccount);
      
      console.log("Active Account Address:", activeAccount.address);
      return activeAccount.address.toLowerCase(); // Return the address
    }
    console.error("No active account found.");
    return undefined;
  }

  const logout = () => {
    hasLoggedIn.current = false;
    dispatch(clearCurrentUser());
    navigate("/", { replace: true });
  };

  useEffect(() => {
    if (!activeAccount?.address && hasLoggedIn.current == true) {
      logout();
    }
  }, [activeAccount, dispatch, navigate]);

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
          dispatch(
            setCurrentUser({
              memberAddr: result.member.memberAddr,
              daoMultiSig: result.member.daoMultiSig || "",
              firstName: result.member.firstName,
              lastName: result.member.lastName,
              email: result.member.email,
              role: result.member.memberRole,
              phoneNumber: result.member.phoneNumber,
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
  }, [activeAccount, dispatch, location, navigate]);

  const daoMultiSig = address?.toLowerCase();

  const handleDaoToolKitClick = (e: React.MouseEvent) => {
    if (address && hasLoggedIn.current == false) {
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
      className != "DaoProfile" &&
      className != "navbarOwner" &&
      className != "joinPlatformNav"
    ) {
      return (
        <button
          onClick={() =>
            navigate(
              role === "Chairperson" || role === "Member"
                ? `/Owner/${address.toLowerCase()}`
                : `/Funder/${address.toLowerCase()}`
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
          <Link to="/DaoRegistration">Fungua DAO</Link>
        </li>
        <li>
          <Link to="/JifunzeElimu">Jifunze/Elimu</Link>
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
