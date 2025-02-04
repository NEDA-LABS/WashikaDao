import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";

interface ProposalData {
  proposalId: number;
  proposalOwner: string;
  proposalTitle: string;
  projectSummary: string;
  proposalDescription: string;
  proposalStatus: "open" | "closed";
  amountRequested: number;
  profitSharePercent: number;
  daoMultiSigAddr: string;
  numUpVotes: number;
  numDownVotes: number;
}

const ProposalGroups: React.FC = () => {
  const { daoMultiSig } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const [proposals, setProposals] = useState<ProposalData[]>([]);

  // Fetch proposals from the API
  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/ViewProposal/DaoDetails/${daoMultiSig}/proposals`
        );
        const data = await response.json();
        setProposals(data.proposals);
      } catch (error) {
        console.error("Error fetching proposals:", error);
      }
    };

    fetchProposals();
  }, [daoMultiSig]);
  console.log(proposals);
  const handleProposalClick = () => {
    navigate("/viewProposal");
  };

  return (
    <div className="proposal-groups">
      {proposals ? (
        proposals.map((proposal) => (
          <div className="proposal" key={proposal.proposalId}>
            <div className="one">
              <h1>{proposal.proposalTitle}</h1>
              <div
                className={
                  proposal.proposalStatus === "open" ? "inProgress" : "rejected"
                }
              >
                {proposal.proposalStatus}
              </div>
            </div>
            <p className="two">{proposal.proposalDescription}</p>
            <div className="three">
              <div className="button-group button">
                <button onClick={handleProposalClick}>Vote on Proposal</button>
                <button className="button-2" onClick={handleProposalClick}>
                  View linked resources
                </button>
              </div>
              <div className="proposal-right">
                <h2>Amount Requested</h2>
                <p>
                  {proposal.amountRequested}
                  <span>Tsh</span>
                </p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="noProposals">
          <p>No Proposals found</p>
          <p>Created Proposals will appear here</p>
        </div>
      )}
    </div>
  );
};

export default ProposalGroups;
