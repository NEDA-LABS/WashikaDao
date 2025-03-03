import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { BASE_BACKEND_ENDPOINT_URL } from "../utils/backendComm";
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
  proposalCustomIdentifier: string;
}


const ProposalGroups: React.FC = () => {
  const navigate = useNavigate();
  const [proposals, setProposals] = useState<ProposalData[]>([]);
  const selectedDaoTxHash = localStorage.getItem("selectedDaoTxHash");
  const userDaos = useSelector((state: RootState) => state.userDaos.daos);
  const selectedDao = userDaos.find((dao) => dao.daoTxHash === selectedDaoTxHash);
  const daoMultiSigAddr = selectedDao ? selectedDao.daoMultiSigAddr : "";;


  // Fetch proposals from the API
  useEffect(() => {
    const token = localStorage.getItem("token") ?? "";
    const fetchProposals = async () => {
      try {
        const response = await fetch(
          `${BASE_BACKEND_ENDPOINT_URL}/DaoKit/Proposals/GetAllProposalsInDao/?daoMultiSigAddr=${daoMultiSigAddr}`,{
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },}
        );
        const data = await response.json();
        console.log(data);
        
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
          <Link to={`/ViewProposal/${daoMultiSigAddr}/${proposal.proposalCustomIdentifier}`}>
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
