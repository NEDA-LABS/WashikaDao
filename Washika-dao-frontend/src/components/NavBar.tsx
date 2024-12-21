import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { RootState } from "../redux/store";
import { clearCurrentUser } from "../redux/users/userSlice";
import ConnectWallet from "./auth/ConnectWallet.tsx";
import { useState } from "react";
import { Account } from "thirdweb/wallets";
import { useActiveAccount } from "thirdweb/react";

interface NavBarProps {
  className: string;
}

const NavBar: React.FC<NavBarProps> = ({ className }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { firstName, memberAddr, daoMultiSig } = useSelector(
    (state: RootState) => state.user
  );
  //Simpler User state management ? 
  const [currActiveAcc, setCurrActiveAcc] = useState<Account | undefined>(undefined); 
  const activeAccount = useActiveAccount();

  const handleClick = () => {
    navigate("/JoinPlatform");
  };

  /**handleCreateAccount for wallet & authentication
  function handleCreateAcount(){
    ConnectWallet();
  }
**/
  const handleDaoToolKitClick = (e: React.MouseEvent) => {
    if (!daoMultiSig) {
      e.preventDefault(); // Prevents default link action
      navigate("/JoinPlatform");
    }
  };

  const daoMultiSIgAddr = daoMultiSig;

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
            to={`/DaoProfile/${daoMultiSIgAddr || ""}`}
            onClick={handleDaoToolKitClick}
          >
            DAO Tool Kit
          </Link>
        </li>
      );
    }
  };

  const handleLogout = () => {
    // Dispatch action to clear current user data
    dispatch(clearCurrentUser());
    // Navigate to the login or home page after logout
    navigate("/");
  };

  const renderButton = () => {
    if (memberAddr && className != "DaoProfile" && className != "navbarOwner") {
      // If memberAddr is present, display "Profile" and navigate to ownerProfile
      return (
        <button onClick={() => navigate(`/Owner/${memberAddr}`)}>
          Profile
        </button>
      );
    } else if (className === "DaoProfile" || className === "navbarProposal") {
      return <button onClick={handleClick}>JIUNGE NASI</button>;
    } else if (className === "navbarOwner") {
      return firstName ? (
        // If user is logged in, show the logout button

        <button onClick={handleLogout}>Logout</button>
      ) : (
        // If no user data, show a sign-in button
        <button onClick={handleClick}>Sign in</button>
      );
    } else if (className === "joinPlatformNav") {
      return <button>Karibu</button>;
    }
    return <button onClick={handleClick}> Sign in </button>;
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

