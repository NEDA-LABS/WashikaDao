import { Link, useNavigate } from "react-router-dom";

interface NavBarProps {
  className: string;
}
const NavBar: React.FC<NavBarProps> = ({className}) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/DaoProfile")
  } 
  return (
    <nav className={className}>
      <div>
        <img src="images/LOGO SYMBLO(1).png" alt="logo" width="24" />
        <Link to="/">
          <img src="images/words logo.png" alt="logo" />
        </Link>
      </div>
      <ul>
        <li>
          <Link to="/DaoRegistration">Fungua DAO</Link>
        </li>
        <li>
          <Link to="/JifunzeElimu">Jifunze/Elimu</Link>
        </li>
        <li className="three">
          <Link to="/DaoProfile">DAO Tool Kit</Link>
        </li>
        <li>
          <button onClick={handleClick}>Karibu</button>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
