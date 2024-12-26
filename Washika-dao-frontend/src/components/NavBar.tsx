import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearCurrentUser, setCurrentUser } from "../redux/users/userSlice";
import { createThirdwebClient } from "thirdweb";
import {
  ConnectButton,
  useActiveAccount,
  lightTheme,
} from "thirdweb/react";
import { Account, inAppWallet } from "thirdweb/wallets";
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
  const activeAccount = useActiveAccount();
  const [MemberAddr, setMemberAddr] = useState<Account | undefined>(undefined);
  const memberAddr = MemberAddr?.address;
  const urlToRedirectTo = `http://localhost:5173/Owner/${memberAddr}`;
  const wasConnected = useRef(false);
  const hasLoggedIn = useRef(false);
  const isInitialLogin = useRef(true);

  function handleGetActiveAccount(): string | undefined {
    if (activeAccount?.address) {
      console.log("Active Account Address:", activeAccount.address);
      setMemberAddr(activeAccount);
      return activeAccount.address; // Return the address
    }
    console.error("No active account found.");
    return undefined;
  }
  console.log("memberAddr:", memberAddr);

  useEffect(() => {
    if (activeAccount?.address) {
      wasConnected.current = true;
    } else if (wasConnected.current && !activeAccount?.address) {
      dispatch(clearCurrentUser());
      navigate("/");
      wasConnected.current = false;
      hasLoggedIn.current = false;
      isInitialLogin.current = true;
    }
  }, [activeAccount, dispatch, navigate]);

  const wallets = [
    inAppWallet({
      auth: {
        mode: "popup", //options are "popup" | "redirect" | "window"
        options: ["email", "google", "phone"], //["discord", "google", "apple", "email", "phone", "farcaster"]
        redirectUrl: urlToRedirectTo,
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
              body: JSON.stringify({ memberAddr: address }),
            }
          );

          const result = await response.json();
          if (response.ok) {
            console.log("Login successful:", result.message);
            hasLoggedIn.current = true;
            dispatch(
              setCurrentUser({
                memberAddr: result.member.memberAddr,
                daoMultiSig: result.member.daoMultiSig || "",
                firstName: result.member.firstName,
                lastName: result.member.lastName,
                role: result.member.memberRole,
                phoneNumber: result.member.phoneNumber,
              })
            );

            if (
              result?.member?.memberAddr &&
              isInitialLogin.current &&
              !hasLoggedIn.current
            ) {
              isInitialLogin.current = false;
              navigate(
                result.member.memberRole === "Owner" ||
                  result.member.memberRole === "Member"
                  ? `/Owner/${result.member.memberAddr}`
                  : `/Funder/${result.member.memberAddr}`
              );
            }
            } else {
            console.error("Login failed:", result.error);
            navigate("/JoinPlatform", {state: { memberAddr}});
          }
        } catch (error) {
          console.error("Login request failed:", error);
        }
      };

      if (activeAccount?.address && !hasLoggedIn.current) {
        const address = handleGetActiveAccount();
        if (address) {
          loginMember(address);
        }
      }
    }, [activeAccount, dispatch, navigate]); 

  const daoMultiSig = memberAddr;

  const handleDaoToolKitClick = (e: React.MouseEvent) => {
    if (!daoMultiSig) {
      e.preventDefault(); // Prevents default link action
      navigate("/JoinPlatform");
    }
  };
  
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
    if (memberAddr && className != "DaoProfile" && className != "navbarOwner" && className != "joinPlatformNav") {
      // If memberAddr is present, display "Profile" and navigate to ownerProfile
      return (
        <button onClick={() => navigate(`/Owner/${memberAddr}`)}>
          Profile
        </button>
      );
    } else if (memberAddr && className === "joinPlatformNav"){
      return (
        <button>Sign In</button>
      )
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
        <li className="show">{renderButton()}</li>
      </ul>
    </nav>
  );
};

export default NavBar;
