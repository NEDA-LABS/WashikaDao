import { Link, useNavigate } from "react-router-dom";
import { FullDaoContract } from "../../utils/handlers/Handlers";
import { useReadContract } from "thirdweb/react";
import { OnChainProposal } from "../../utils/Types";

interface ProposalCardProps {
  p: OnChainProposal;
  now: number;
  daoId: string;
  navigate: ReturnType<typeof useNavigate>;
}

export const ProposalCard: React.FC<ProposalCardProps> = ({
  p,
  now,
  daoId,
  navigate,
}) => {
  const createdTs = Number(p.proposalCreatedAt) * 1000;
  const expiryTs = createdTs + 24 * 3600 * 1000;
  const expired = now >= expiryTs;

  // after expiry, read the official outcome
  const { data: outcome, isLoading: loadingOutcome } = useReadContract({
    contract: FullDaoContract,
    method:
      "function getProposalOutcome(bytes32 _proposalId) view returns (string)",
    params: [p.proposalId],
  });

  // choose display status
  const displayStatus =
    expired && !loadingOutcome && outcome ? outcome : p.proposalStatus;

  const identifier = encodeURIComponent(p.proposalTitle);

  return (
    <Link to={`/ViewProposal/${identifier}`} state={{ proposal: p }}>
      <div className="proposal">
        <div className="one">
          <h1>{p.proposalTitle}</h1>
          <div className="inProgress">{displayStatus}</div>
        </div>
        <p className="two">proposal description  Lorem ipsum dolor, sit amet consectetur adipisicing elit. Reprehenderit commodi amet quae omnis voluptates, culpa quam eveniet dignissimos.</p>
        <div className="three">
          <div className="button-group button">
            <button
              onClick={() => navigate(`/ViewProposal/${identifier}`)}
            >
              Vote on Proposal
            </button>
            <button
              className="button-2"
              onClick={() => navigate(`/ViewProposal/${daoId}/${identifier}`)}
            >
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
};
