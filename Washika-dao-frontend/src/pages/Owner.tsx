// import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Dashboard from "../components/Dashboard";
import Footer from "../components/Footer";
import NavBar from "../components/Navbar/Navbar";
import ProposalGroups from "../components/Proposals/ProposalGroups";
import Strip from "../components/Strip";
import { RootState } from "../redux/store";
/**
 * @Auth Policy: Requires auth in order to be able to fetch data concerning the owner 
 * @returns 
 */
/**
 * Owner component serves as the main dashboard for DAO owners, providing an overview
 * of financial operations and proposals. It displays user-specific information such as
 * the user's first name and various financial metrics including total deposits, loans,
 * shares, repayments, and interest earned. The component also includes navigation
 * elements and interactive buttons for financial actions and settings adjustments.
 * 
 * @component
 * @returns {JSX.Element} A JSX element representing the owner's dashboard.
 * 
 * @remarks
 * - Requires authentication to access user-specific data.
 * - Utilizes `useSelector` from `react-redux` to fetch user data from the Redux store.
 * - Integrates FontAwesome icons for visual representation of financial metrics.
 * 
 * @dependencies
 * - `NavBar`, `Footer`, `ProposalGroups`, and `Strip` components for layout.
 * - `react-redux` for state management.
 * - `@fortawesome/react-fontawesome` for icons.
 * 
 * @example
 * <Owner />
 */
const Owner: React.FC = () => {
  // const navigate = useNavigate();
  const { firstName } = useSelector((state: RootState) => state.user);
  // const { daoMultiSig } = useSelector((state: RootState) => state.user);
  // const handleClick = () => {
  //   navigate(`/CreateProposal/${daoMultiSig}`);
  // };
  return (
    <>
      <NavBar className={"navbarOwner"} />
      <main className="owner">
        <div className="tops">
          <div className="one">
            <h1>Hi, {firstName}</h1>
            <p>Welcome to your one-stop platform for your DAO operations</p>
          </div>
          <img
            src="/images/Vector.png"
            alt="vector icon"
            width={48}
            height={114}
          />
        </div>

        <div className="button-group buttons">
          <button>Account Information</button>
          <button>Deposit Payments</button>
          <button>Fund a DAO</button>
          <button>Edit Settings</button>
        </div>

        <div className="dashboard-wrapper">
          <h2>This is your account information</h2>
          <Dashboard address={undefined}/>
        </div>

        <section className="second">
          <div className="sec">
            <img src="/images/Vector(4).png" alt="logo" />
            <h1>My Proposals</h1>
          </div>
          <ProposalGroups />
        </section>
      </main>
      <Strip />
      <Footer className={"ownerFooter"} />
    </>
  );
};

export default Owner;
