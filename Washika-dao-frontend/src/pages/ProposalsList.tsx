import "../styles/index.css";
import { useReadContract } from "thirdweb/react";
import { FullDaoContract } from "../utils/handlers/Handlers.js";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ProposalsList() {
  const daoId = (localStorage.getItem("daoId") ?? "") as `0x${string}`;
  const { data, isLoading, error } = useReadContract({
    contract: FullDaoContract,
    method: "getProposals",
    params: [daoId],
  });
  const [proposals, setProposals] = useState<any[]>([]);

  useEffect(() => {
    if (data && Array.isArray(data)) {
      setProposals(data);
    }
  }, [data]);

  if (isLoading) {
    return <div className="p-8">Loading proposals...</div>;
  }
  if (error) {
    return <div className="text-red-600 p-8">Error loading proposals: {error.message}</div>;
  }
  if (!proposals.length) {
    return <div className="p-8 text-gray-500">No proposals found for this DAO.</div>;
  }

  return (
    <div className="proposals-list max-w-3xl mx-auto mt-12 p-8 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Proposals</h1>
      <ul className="space-y-4">
        {proposals.map((proposal) => (
          <li key={proposal.proposalId} className="border rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between hover:bg-gray-50 transition">
            <div>
              <div className="font-semibold text-lg">{proposal.proposalTitle}</div>
              <div className="text-gray-600">Status: {proposal.proposalStatus}</div>
              <div className="text-gray-600">Owner: {proposal.proposalOwner}</div>
            </div>
            <Link
              to={`/proposals/${proposal.proposalId}`}
              className="mt-4 md:mt-0 bg-yellow-600 text-white px-4 py-2 rounded shadow hover:bg-yellow-700 transition"
            >
              View Proposal
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
} 