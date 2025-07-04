// ProposalGroups.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useReadContract } from "thirdweb/react";
import { FullDaoContract } from "../../utils/handlers/Handlers.js";
import { ProposalCard } from "./ProposalCard.js";
import { OnChainProposal } from "../../utils/Types.js";

const ZERO_BYTES32 =
  "0x0000000000000000000000000000000000000000000000000000000000000000" as const;
const PAGE_SIZE = 2;

type ProposalGroupsProps = {
  ownerFilter?: string;
};

const ProposalGroups: React.FC<ProposalGroupsProps> = ({ ownerFilter }) => {
  const navigate = useNavigate();
  const daoId = (localStorage.getItem("daoId") ||
    ZERO_BYTES32) as `0x${string}`;

  // abitype/thirdweb type workaround: ignore type errors for contract call object
  // @ts-ignore
  const {
    data: rawProposals,
    isLoading,
    error,
  } = useReadContract({
    // @ts-ignore
    contract: FullDaoContract,
    method:
      "function getProposals(bytes32 _daoId) view returns ((address proposalOwner, bytes32 proposalId, bytes32 daoId, string proposalUrl, string proposalTitle, string proposalStatus, uint256 proposalCreatedAt)[])",
    params: [daoId] as const,
  }) as {
    data?: OnChainProposal[];
    isLoading: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any;
  };

  // live clock
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const iv = setInterval(() => setNow(Date.now()), 5_000);
    return () => clearInterval(iv);
  }, []);

  const [currentPage, setCurrentPage] = useState(0);

  if (isLoading)
    return (
      <div className="noProposals">
        <p>Loading proposals…</p>
      </div>
    );
  if (error) {
    console.error(error);
    return (
      <div className="noProposals">
        <p>Error loading proposals.</p>
      </div>
    );
  }
  if (!rawProposals || rawProposals.length === 0) {
    return (
      <div className="noProposals">
        <p>No proposals found</p>
        <p>Create one to see it listed here</p>
      </div>
    );
  }

  // apply owner filter
  const filtered = ownerFilter
    ? rawProposals.filter(
        (p) => p.proposalOwner.toLowerCase() === ownerFilter.toLowerCase()
      )
    : rawProposals;

  // paging
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const start = currentPage * PAGE_SIZE;
  const pageItems = [...filtered].reverse().slice(start, start + PAGE_SIZE);

  return (
    <div className="proposal-groups">
      {pageItems.map((p) => (
        <ProposalCard
          key={p.proposalId}
          p={p}
          now={now}
          daoId={daoId}
          navigate={navigate}
        />
      ))}

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
