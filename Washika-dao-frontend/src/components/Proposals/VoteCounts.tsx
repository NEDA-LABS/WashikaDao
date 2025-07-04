// src/components/VoteCounts.tsx
import React from "react";
import { useReadContract } from "thirdweb/react";
import { FullDaoContract } from "../../utils/handlers/Handlers.js";

interface VoteCountsProps {
  proposalId: `0x${string}`;
}

const VoteCounts: React.FC<VoteCountsProps> = ({ proposalId }) => {
  const { data: upVotes, isLoading: loadingUp } = useReadContract({
    contract: FullDaoContract,
    method: "function getUpVotes(bytes32 _proposalId) view returns (uint256)",
    params: [proposalId],
  });

  const { data: downVotes, isLoading: loadingDown } = useReadContract({
    contract: FullDaoContract,
    method: "function getDownVotes(bytes32 _proposalId) view returns (uint256)",
    params: [proposalId],
  });

  return (
    <div className="buttons buttonss">
              <p className="onee">
                👍 Yes: {loadingUp ? "…" : upVotes?.toString() ?? "0"}
              </p>
              <p className="twoe">
                👎 No: {loadingDown ? "…" : downVotes?.toString() ?? "0"}
              </p>
            </div>
  );
};

export default VoteCounts;
