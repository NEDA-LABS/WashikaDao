import "../styles/index.css";
import "../styles/CreateProposal.css";
import { useState } from "react";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import { prepareContractCall } from "thirdweb";
import { FullDaoContract } from "../utils/handlers/Handlers.js";
import { useProposalForm } from "../hooks/useProposalForm.js";

/**
 * @swagger
 * /daos/{daoId}/proposals/create:
 *   get:
 *     summary: Render proposal creation form
 *   post:
 *     summary: Create a new proposal
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Proposal created
 */

export default function ProposalCreate() {
  const account = useActiveAccount();
  const { mutate: sendTx, isPending } = useSendTransaction();
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { proposalData, handleChange, handleFileChange } = useProposalForm();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);
    if (!account) {
      setError("Please connect your wallet to create a proposal.");
      return;
    }
    if (!proposalData.proposalTitle || !proposalData.proposalUrl || !proposalData.daoId) {
      setError("All fields are required.");
      return;
    }
    try {
      // @ts-ignore
      const tx = prepareContractCall({
        contract: FullDaoContract,
        method: "createProposal",
        params: [proposalData.proposalUrl, proposalData.proposalTitle, proposalData.daoId],
      });
      // @ts-ignore
      sendTx(tx, {
        onSuccess: (receipt) => {
          setSuccess(`Proposal created! Tx: ${receipt.transactionHash}`);
        },
        onError: (err) => {
          setError(err.message || "Failed to create proposal");
        },
      });
    } catch (err: any) {
      setError(err.message || "Failed to create proposal");
    }
  };

  if (!account) {
    return (
      <div className="proposal-create-form max-w-lg mx-auto mt-12 p-8 bg-white rounded shadow">
        <h1 className="text-2xl font-bold mb-6">Create a New Proposal</h1>
        <div className="error bg-red-100 text-red-800 p-4 mt-4 rounded">
          Please connect your wallet to create a proposal.
        </div>
      </div>
    );
  }

  return (
    <div className="proposal-create-form max-w-lg mx-auto mt-12 p-8 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Create a New Proposal</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="text-gray-700">Title</span>
          <input name="proposalTitle" required value={proposalData.proposalTitle} onChange={handleChange} className="mt-1 block w-full border rounded p-2" />
        </label>
        <label className="block">
          <span className="text-gray-700">Proposal File (PDF, IPFS, etc.)</span>
          <input type="file" accept=".pdf,.doc,.docx,.txt,.md,.json,.png,.jpg,.jpeg" onChange={handleFileChange} className="mt-1 block w-full border rounded p-2" />
        </label>
        {proposalData.proposalUrl && (
          <div className="text-green-700 text-sm">File uploaded: {proposalData.proposalUrl}</div>
        )}
        <button type="submit" disabled={isPending} className="w-full bg-yellow-600 text-white py-2 rounded mt-4">
          {isPending ? "Creating..." : "Create Proposal"}
        </button>
      </form>
      {success && (
        <div className="success bg-green-100 text-green-800 p-4 mt-4 rounded">
          {success}
        </div>
      )}
      {error && (
        <div className="error bg-red-100 text-red-800 p-4 mt-4 rounded">
          {error}
        </div>
      )}
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error("ProposalCreate Error:", error);
  return <div className="text-red-600 p-8">An error occurred: {error.message}</div>;
}

export function HydrateFallback() {
  return <div className="p-8">Loading proposal creation form...</div>;
} 