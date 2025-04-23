import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// import { BASE_BACKEND_ENDPOINT_URL } from "../utils/backendComm";
// import { RootState } from "../redux/store";
// import { useSelector } from "react-redux";
import { useReadContract, useActiveAccount } from "thirdweb/react";
import { FullDaoContract } from "../utils/handlers/Handlers";

// interface ProposalData {
//   proposalId: number;
//   proposalOwner: string;
//   proposalTitle: string;
//   projectSummary: string;
//   proposalDescription: string;
//   proposalStatus: "open" | "closed";
//   amountRequested: number;
//   profitSharePercent: number;
//   daoMultiSigAddr: string;
//   numUpVotes: number;
//   numDownVotes: number;
//   proposalCustomIdentifier: string;
// }

interface OnChainProposal {
  pOwner: string;
  daoMultiSigAddr: string;
  pTitle: string;
  pSummary: string;
  pDescription: string;
  expirationTime: bigint; // BigNumber from contract
}

const PAGE_SIZE = 5;

const ProposalGroups: React.FC = () => {
  const navigate = useNavigate();
  const activeAccount = useActiveAccount();
  // const selectedDaoTxHash = localStorage.getItem("selectedDaoTxHash");
  // const userDaos = useSelector((state: RootState) => state.userDaos.daos);
  // const selectedDao = userDaos.find((dao) => dao.daoTxHash === selectedDaoTxHash);
  const daoMultiSigAddr = activeAccount?.address || "";

  // 1) Read all proposals on-chain
  const {
    data: rawProposals,
    isLoading,
    error,
  } = useReadContract({
    contract: FullDaoContract,
    method: "getProposals",
    params: [daoMultiSigAddr],
  }) as {
    data?: OnChainProposal[];
    isLoading: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any;
  };

  const [currentPage, setCurrentPage] = useState(0);

  if (isLoading) {
    return <div>Loading on-chain proposals…</div>;
  }
  if (error) {
    console.error(error);
    return <div>Error loading on-chain proposals.</div>;
  }
  if (!rawProposals || rawProposals.length === 0) {
    return (
      <div className="noProposals">
        <p>No proposals found on-chain</p>
        <p>Create one to see it listed here</p>
      </div>
    );
  }
  const handleProposalClick = () => {
    navigate("/viewProposal");
  };

  // pagination logic
  const totalPages = Math.ceil(rawProposals.length / PAGE_SIZE);
  const start = currentPage * PAGE_SIZE;
  const proposalsRev = [...rawProposals].reverse();
  const pageItems = proposalsRev.slice(start, start + PAGE_SIZE);

  return (
    <div className="proposal-groups">
      {pageItems.map((p) => {
        // use the title as your client‐side “identifier’
        const identifier = encodeURIComponent(p.pTitle);
        // const expiry = new Date(Number(p.expirationTime) * 1000).toLocaleDateString();
        return (
          <Link
            key={p.pTitle}
            to={`/ViewProposal/${daoMultiSigAddr}/${identifier}`}
          >
            <div className="proposal">
              <div className="one">
                <h1>{p.pTitle}</h1>
                <div className="inProgress">open</div>
              </div>
              <p className="two">{p.pDescription}</p>
              <div className="three">
                <div className="button-group button">
                  <button onClick={handleProposalClick}>
                    Vote on Proposal
                  </button>
                  <button className="button-2" onClick={handleProposalClick}>
                    View linked resources
                  </button>
                </div>
                {/* <div className="proposal-right">
                  <h2>Expires</h2>
                  <p>{expiry}</p>
                </div> */}
                <div className="proposal-right">
                  <h2>Amount Requested</h2>
                  <p>
                    600
                    <span>Usd</span>
                  </p>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
      {/* pagination controls */}
      <div
        className="pagination-controls"
        style={{ marginTop: "1rem", textAlign: "center" }}
      >
        <button
          onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
          disabled={currentPage === 0}
          style={{ marginRight: "1rem" }}
        >
          Prev
        </button>
        <span>
          Page {currentPage + 1} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
          disabled={currentPage + 1 >= totalPages}
          style={{ marginLeft: "1rem" }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProposalGroups;
