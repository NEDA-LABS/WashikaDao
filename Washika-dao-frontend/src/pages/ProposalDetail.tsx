import "../styles/index.css";
import "../styles/ViewProposal.css";
import { useEffect, useState } from "react";
// @ts-ignore
import { useParams } from "react-router-dom";
import {
  useReadContract,
  useSendTransaction,
  useActiveAccount,
} from "thirdweb/react";
import { prepareContractCall, readContract } from "thirdweb";
import { FullDaoContract } from "../utils/handlers/Handlers.js";

/**
 * @swagger
 * /daos/{daoId}/proposals/{proposalId}:
 *   get:
 *     summary: Get proposal details
 *     parameters:
 *       - in: path
 *         name: daoId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: proposalId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Proposal details
 */
export async function loader({ params }: { params: any }) {
  // TODO: Fetch proposal details
  return { daoId: params.daoId, proposalId: params.proposalId };
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error("ProposalDetail Error:", error);
  return <div className="text-red-600 p-8">An error occurred: {error.message}</div>;
}

export function HydrateFallback() {
  return <div className="p-8">Loading proposal details...</div>;
}

// TypeScript interface for ProposalDetails struct
interface ProposalDetails {
  proposalOwner: string;
  proposalId: `0x${string}`;
  daoId: `0x${string}`;
  proposalUrl: string;
  proposalTitle: string;
  proposalStatus: string;
  proposalCreatedAt: bigint | number;
}

// Add VoteDetails type
interface VoteDetails {
  voterAddress: string;
  proposalId: `0x${string}`;
  daoId: `0x${string}`;
  voteId: `0x${string}`;
  voteType: boolean;
}

export default function ProposalDetail() {
  // @ts-ignore
  const { proposalTitle } = useParams<{ proposalTitle: string }>();
  const account = useActiveAccount();
  const { mutate: sendTx, isPending } = useSendTransaction();
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userHasVoted, setUserHasVoted] = useState<boolean | null>(null);
  const [voteCounts, setVoteCounts] = useState<{ up: number; down: number }>({ up: 0, down: 0 });

  // 1. Fetch proposalId by title
  // @ts-ignore
  const { data: proposalId, isLoading: loadingId } = useReadContract({
    contract: FullDaoContract,
    method: "getProposalIdByTitle",
    params: [proposalTitle!],
  });

  // 2. Fetch proposal details by proposalId
  // @ts-ignore
  const {
    data: proposalRaw,
    isLoading: loadingProposal,
    error: fetchError,
  } = useReadContract({
    contract: FullDaoContract,
    method: "getProposalXById",
    params: proposalId ? [proposalId as `0x${string}`] : [],
  });
  // Type assertion for proposal details
  const proposal = proposalRaw as ProposalDetails | undefined;

  // 3. Fetch hasVoted
  // @ts-ignore
  const { data: hasVoted, isLoading: loadingHasVoted } = useReadContract({
    contract: FullDaoContract,
    method: "hasVoted",
    params: proposalId && account?.address ? [account.address, proposalId as `0x${string}`] : [],
  });

  // 4. Fetch vote counts
  // @ts-ignore
  const { data: upVotes } = useReadContract({
    contract: FullDaoContract,
    method: "getUpVotes",
    params: proposalId ? [proposalId as `0x${string}`] : [],
  });
  // @ts-ignore
  const { data: downVotes } = useReadContract({
    contract: FullDaoContract,
    method: "getDownVotes",
    params: proposalId ? [proposalId as `0x${string}`] : [],
  });

  useEffect(() => {
    if (typeof hasVoted === "boolean") setUserHasVoted(hasVoted);
    if (typeof upVotes === "number" && typeof downVotes === "number") {
      setVoteCounts({ up: upVotes, down: downVotes });
    }
  }, [hasVoted, upVotes, downVotes]);

  // 5. Voting handlers
  const handleVote = (type: "up" | "down") => {
    setSuccess(null);
    setError(null);
    if (!proposalId || !proposal) return;
    // @ts-ignore
    const tx = prepareContractCall({
      contract: FullDaoContract,
      method: type === "up" ? "upVote" : "downVote",
      params: [proposalId, proposal.daoId],
    });
    // @ts-ignore
    sendTx(tx, {
      onSuccess: (receipt) => {
        setSuccess(`Vote successful! Tx: ${receipt.transactionHash}`);
        setUserHasVoted(true);
      },
      onError: (err) => {
        setError(err.message || "Failed to vote");
        setUserHasVoted(false);
      },
    });
  };

  // Fetch total number of votes (voteDetails is an array)
  // @ts-ignore
  const { data: voteDetailsLengthRaw } = useReadContract({
    // @ts-ignore
    contract: FullDaoContract,
    method: "function voteDetailsLength() view returns (uint256)",
    params: [],
  });
  const voteDetailsLength = typeof voteDetailsLengthRaw === "bigint" ? Number(voteDetailsLengthRaw) : voteDetailsLengthRaw;

  // Fetch all votes for this proposal by iterating voteDetails
  const [voteHistory, setVoteHistory] = useState<VoteDetails[]>([]);
  useEffect(() => {
    async function fetchVotes() {
      if (!proposal || typeof voteDetailsLength !== "number") return;
      const votes: VoteDetails[] = [];
      for (let i = 0; i < voteDetailsLength; i++) {
        // @ts-ignore
        const tuple = await readContract({
          // @ts-ignore
          contract: FullDaoContract,
          method: "function voteDetails(uint256) view returns (address,bytes32,bytes32,bytes32,bool)",
          // @ts-ignore
          params: [BigInt(i)],
        });
        // tuple: [voterAddress, proposalId, daoId, voteId, voteType]
        if (tuple && tuple[1] === proposal.proposalId) {
          votes.push({
            voterAddress: tuple[0],
            proposalId: tuple[1],
            daoId: tuple[2],
            voteId: tuple[3],
            voteType: tuple[4],
          });
        }
      }
      setVoteHistory(votes);
    }
    fetchVotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proposal, voteDetailsLength]);

  if (loadingId || !proposalId) {
    return <div className="p-8">Loading proposal details...</div>;
  }
  if (loadingProposal) {
    return <div className="p-8">Loading proposal details...</div>;
  }
  if (fetchError) {
    return <div className="text-red-600 p-8">Error loading proposal: {fetchError.message}</div>;
  }
  if (!proposal) {
    return <div className="p-8 text-gray-500">Proposal not found.</div>;
  }

  return (
    <div className="proposal-detail max-w-2xl mx-auto mt-12 p-8 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">{proposal.proposalTitle}</h1>
      <div className="mb-2 text-gray-600">Status: {proposal.proposalStatus}</div>
      <div className="mb-2 text-gray-600">Owner: {proposal.proposalOwner}</div>
      <div className="mb-2 text-gray-600">Created: {new Date(Number(proposal.proposalCreatedAt) * 1000).toLocaleString()}</div>
      <div className="mb-2 text-gray-600">Proposal URL: <a href={proposal.proposalUrl} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">View</a></div>
      <div className="mb-4 text-gray-600">DAO ID: {proposal.daoId}</div>
      <div className="mb-4">
        <span className="font-semibold">Votes:</span> 👍 {voteCounts.up} / 👎 {voteCounts.down}
      </div>
      {success && <div className="bg-green-100 text-green-800 p-4 mb-4 rounded">{success}</div>}
      {error && <div className="bg-red-100 text-red-800 p-4 mb-4 rounded">{error}</div>}
      {loadingHasVoted ? (
        <div className="text-gray-500">Checking vote status…</div>
      ) : userHasVoted ? (
        <div className="text-green-700">✅ You have voted for this proposal.</div>
      ) : (
        <div className="flex gap-4">
          <button
            className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition"
            onClick={() => handleVote("up")}
            disabled={isPending}
          >
            👍 Vote Yes
          </button>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700 transition"
            onClick={() => handleVote("down")}
            disabled={isPending}
          >
            👎 Vote No
          </button>
        </div>
      )}

      {/* Vote History Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Vote History</h2>
        {voteHistory.length === 0 ? (
          <div className="text-gray-500">No votes yet.</div>
        ) : (
          <table className="min-w-full text-sm border">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-2 py-1 border">Voter Address</th>
                <th className="px-2 py-1 border">Vote Type</th>
                <th className="px-2 py-1 border">Vote ID</th>
                {/* TODO: Add timestamp if available in contract */}
              </tr>
            </thead>
            <tbody>
              {voteHistory.map((vote, idx) => (
                <tr key={vote.voteId} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-2 py-1 border font-mono">{vote.voterAddress}</td>
                  <td className="px-2 py-1 border">{vote.voteType ? "👍 Yes" : "👎 No"}</td>
                  <td className="px-2 py-1 border font-mono">{vote.voteId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
} 