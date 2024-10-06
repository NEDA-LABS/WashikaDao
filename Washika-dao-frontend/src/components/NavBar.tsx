import { Link, useNavigate } from "react-router-dom";

interface NavBarProps {
  className: string;
  // user?: { name: string }; 
}

const NavBar: React.FC<NavBarProps> = ({ className/*, user*/ }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/JoinPlatform");
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
          <Link to="/DaoProfile">DAO Tool Kit</Link>
        </li>
      );
    }
  };

  const renderButton = () => {
    if (className === "DaoProfile" || className === "navbarProposal") {
      return (
        <button onClick={handleClick}>Add Member</button>
      );
    } else if (className === "navbarOwner" /*&& user*/) {
      return (<>
        {/* <button>{user.name}</button> */}
        <button>user.name</button></>
      );
    }
    return (
      <button onClick={handleClick}>Karibu</button>
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
