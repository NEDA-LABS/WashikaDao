import { useNavigate } from "react-router-dom";
import Dashboard from "../Dashboard";
import ProposalGroups from "../Proposals/ProposalGroups";

interface MemberBodyProps {
    memberAddr: string;
}

const MemberBody: React.FC<MemberBodyProps> = ({memberAddr}) => {
  const navigate = useNavigate();
  return (
    <>
      <div className="dashboard-wrapper">
        <h2>This is your account information</h2>
        <Dashboard address={memberAddr} />
      </div>
      <button className="create" onClick={() => navigate("/CreateProposal")}>
        Create a Proposal
      </button>
      <section className="second">
        <div className="sec">
          <img src="/images/Vector4.png" alt="logo" />
          <h1>My Proposals</h1>
        </div>
        <ProposalGroups ownerFilter={memberAddr} />
      </section>
    </>
  );
};

export default MemberBody;
