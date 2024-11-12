import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { RootState } from "../redux/store";


interface NavBarProps {
  className: string;
}

const NavBar: React.FC<NavBarProps> = ({ className }) => {
  const navigate = useNavigate();
  const { firstName, memberAddr, daoMultiSig } = useSelector(
    (state: RootState) => state.user
  );
  const handleClick = () => {
    navigate("/JoinPlatform");
  };

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
        (<li className="three">
          <Link to={`/DaoProfile/${daoMultiSIgAddr || ""}`} onClick={handleDaoToolKitClick}>
            DAO Tool Kit
          </Link>
        </li>)
      );
    }
  };

  const renderButton = () => {
    if (memberAddr) {
      // If memberAddr is present, display "Profile" and navigate to ownerProfile
      return (<button onClick={() => navigate(`/Owner/${memberAddr}`)}>Profile</button>);
    } else if (className === "DaoProfile" || className === "navbarProposal") {
      return (
        <button onClick={handleClick}>Add Member</button>
      );
    } else if (className === "navbarOwner" /*&& user*/) {
      return (<>
        {/* <button>{user.name}</button> */}
        <button>{firstName}</button></>
      );
    } else if (className === "joinPlatformNav") {
      return (
        <button>Karibu</button>
      )
    }
    return (
      <button onClick={handleClick}> Sign in </button>
    );
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
        <li className="show">
          {renderButton()}
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
