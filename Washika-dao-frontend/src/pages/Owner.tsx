import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import ProposalGroups from "../components/ProposalGroups";
import Strip from "../components/Strip";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store"; 
/**
 * @Auth Policy: Requires auth in order to be able to fetch data concerning the owner 
 * @returns 
 */
const Owner: React.FC = () => {
  const navigate = useNavigate();
  const { firstName } = useSelector((state: RootState) => state.user);
  const { daoMultiSig } = useSelector((state: RootState) => state.user);
  const handleClick = () => {
    navigate(`/CreateProposal/${daoMultiSig}`);
  };
  return (
    <>
      <NavBar className={"navbarOwner"} />
      <main className="owner">
        <div className="top">
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

        <div className="button-group">
          <button className="button-1" onClick={handleClick}>
            Create a Proposal
          </button>
          <button className="button-2">Vote on a proposal</button>
        </div>

        <section className="second">
          <div className="myProposals">
            <img src="/images/proposalIcon.png" alt="dashboard icon" />
            <h2>My Proposals</h2>
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
