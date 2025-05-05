// ProposalGroups.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useReadContract } from "thirdweb/react";
import { FullDaoContract } from "../utils/handlers/Handlers";

interface OnChainProposal {
  proposalOwner: string;
  proposalId: `0x${string}`;
  daoId: string;
  proposalUrl: string;
  proposalTitle: string;
  proposalStatus: string;
  proposalCreatedAt: bigint;
}

const ZERO_BYTES32 =
  "0x0000000000000000000000000000000000000000000000000000000000000000" as const;

const PAGE_SIZE = 2;

type ProposalGroupsProps = {
  ownerFilter?: string;
};

const ProposalGroups: React.FC<ProposalGroupsProps> = ({ ownerFilter }) => {
  const navigate = useNavigate();
  const daoId = localStorage.getItem("daoId") || ZERO_BYTES32;

  const {
    data: rawProposals,
    isLoading,
    error,
  } = useReadContract({
    contract: FullDaoContract,
    method:
      "function getProposals(bytes32 _daoId) view returns ((address proposalOwner, bytes32 proposalId, bytes32 daoId, string proposalUrl, string proposalTitle, string proposalStatus, uint256 proposalCreatedAt)[])",
    params: [daoId as `0x${string}`] as const,
  }) as {
    data?: OnChainProposal[];
    isLoading: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any;
  };

  const [currentPage, setCurrentPage] = useState(0);

  if (isLoading) return <div>Loading on-chain proposals…</div>;
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

  // filter by owner if provided
  const filtered = ownerFilter
    ? rawProposals.filter(
        (p) => p.proposalOwner.toLowerCase() === ownerFilter.toLowerCase()
      )
    : rawProposals;

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const start = currentPage * PAGE_SIZE;
  const pageItems = [...filtered].reverse().slice(start, start + PAGE_SIZE);

  return (
    <div className="proposal-groups">
      {pageItems.map((p) => {
        const identifier = encodeURIComponent(p.proposalTitle);
        return (
          <Link
            key={p.proposalId}
            to={`/ViewProposal/${daoId}/${identifier}`}
            state={{ proposal: p }}
          >
            <div className="proposal">
              <div className="one">
                <h1>{p.proposalTitle}</h1>
                <div className="inProgress">{p.proposalStatus}</div>
              </div>
              <p className="two">proposal description</p>
              <div className="three">
                <div className="button-group button">
                  <button onClick={() => navigate(`/ViewProposal/${daoId}/${identifier}`)}>
                    Vote on Proposal
                  </button>
                  <button className="button-2" onClick={() => navigate(`/ViewProposal/${daoId}/${identifier}`)}>
                    View linked resources
                  </button>
                </div>
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