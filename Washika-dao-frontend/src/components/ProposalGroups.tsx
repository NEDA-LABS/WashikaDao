import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";

import { baseUrl } from "../utils/backendComm";

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
  proposalCustomIdentifier: string;
}


const ProposalGroups: React.FC = () => {
  const { daoMultiSig } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const [proposals, setProposals] = useState<ProposalData[]>([]);
  const daoMultiSigAddr = daoMultiSig;
console.log('The multiaddress is', daoMultiSigAddr);


  // Fetch proposals from the API
  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const response = await fetch(
          `http://${baseUrl}/DaoKit/Proposals/GetAllProposalsInDao/${daoMultiSigAddr}`
        );
        const data = await response.json();
        setProposals(data.proposalsFound);
      } catch (error) {
        console.error("Error fetching proposals:", error);
      }
    };

    fetchProposals();
  }, [ daoMultiSigAddr]);
  console.log(proposals);
  const handleProposalClick = () => {
    navigate("/viewProposal");
  };

  return (
    <div className="proposal-groups">
      {proposals ? (
        proposals.map((proposal) => (
          <Link to={`/ViewProposal/${daoMultiSig}/${proposal.proposalCustomIdentifier}`}>
            <div className="proposal" key={proposal.proposalCustomIdentifier}>
              <div className="one">
                <h1>{proposal.proposalTitle}</h1>
                <div
                  className={
                    proposal.proposalStatus === "open"
                      ? "inProgress"
                      : "rejected"
                  }
                >
                  {proposal.proposalStatus}
                </div>
              </div>
              <p className="two">{proposal.proposalDescription}</p>
              <div className="three">
                <div className="button-group button">
                  <button onClick={handleProposalClick}>
                    Vote on Proposal
                  </button>
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
          </Link>
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
