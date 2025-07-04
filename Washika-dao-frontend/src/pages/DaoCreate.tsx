import "../styles/index.css";
import "../styles/DaoRegistration.css";
import { useState } from "react";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import { prepareContractCall } from "thirdweb";
import { FullDaoContract } from "../utils/handlers/Handlers.js";
// @ts-ignore // If you see a type error here, ensure 'react-router-dom' is installed in node_modules
import { useNavigate } from "react-router-dom";
import { getLatestDaoIdByCreatorX } from "../api/contract.js";
import { registerDaoOffchain } from "../utils/backendComm.js";

/**
 * @swagger
 * /daos/create:
 *   post:
 *     summary: Create a new DAO (on-chain, then backend)
 */

export default function DaoCreate() {
  const account = useActiveAccount();
  const { mutate: sendTx, isPending } = useSendTransaction();
  const [form, setForm] = useState({
    name: "",
    location: "",
    objective: "",
    targetAudience: "",
  });
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const activeAccount = useActiveAccount();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);
    setIsSubmitting(true);
    
    if (!account) {
      setError("Please connect your wallet to create a DAO.");
      setIsSubmitting(false);
      return;
    }

    try {
      // @ts-ignore // Type error due to thirdweb/abitype type system limitation; contract instance and ABI are correct
      const tx = prepareContractCall({
        contract: FullDaoContract,
        method: "createDao",
        params: [
          form.location,
          form.objective,
          form.targetAudience,
          form.name,
        ],
      });
    
      sendTx(tx, {
        onSuccess: async (receipt) => {
          setSuccess(`DAO created! Tx: ${receipt.transactionHash}`);

          // Prepare data for backend
          const daoData = {
            ...form, // all form fields
            txHash: receipt.transactionHash,
            creator: account.address, // or activeAccount?.address
          };

          try {
            // Register DAO in backend using existing utility
            await registerDaoOffchain(daoData);
            setSuccess("DAO created successfully on-chain and registered in backend!");
          } catch (err: any) {
            setError("DAO created on-chain, but failed to register in backend: " + err.message);
          }

          if (activeAccount?.address) {
            const daoId = await getLatestDaoIdByCreatorX(activeAccount.address);
            navigate(`/DaoSuperAdmin/${daoId}`);
          }
        },
        onError: (err) => {
          setError(err.message || "Failed to create DAO");
        },
      });
    } catch (err: any) {
      setError(err.message || "Failed to create DAO");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!account) {
    return (
      <div className="dao-create-form max-w-lg mx-auto mt-12 p-8 bg-white rounded shadow">
        <h1 className="text-2xl font-bold mb-6">Create a New DAO</h1>
        <div className="error bg-red-100 text-red-800 p-4 mt-4 rounded">
          Please connect your wallet to create a DAO.
        </div>
      </div>
    );
  }

  return (
    <div className="dao-create-form max-w-lg mx-auto mt-12 p-8 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Create a New DAO</h1>
      
      {/* Form with improved structure */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="text-gray-700">Name</span>
          <input 
            name="name" 
            required 
            value={form.name} 
            onChange={handleChange} 
            className="mt-1 block w-full border rounded p-2" 
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Location</span>
          <input 
            name="location" 
            required 
            value={form.location} 
            onChange={handleChange} 
            className="mt-1 block w-full border rounded p-2" 
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Objective</span>
          <input 
            name="objective" 
            required 
            value={form.objective} 
            onChange={handleChange} 
            className="mt-1 block w-full border rounded p-2" 
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Target Audience</span>
          <input 
            name="targetAudience" 
            required 
            value={form.targetAudience} 
            onChange={handleChange} 
            className="mt-1 block w-full border rounded p-2" 
          />
        </label>
        
        <button 
          type="submit" 
          disabled={isPending || isSubmitting} 
          className="w-full bg-yellow-600 text-white py-2 rounded mt-4"
        >
          {isPending || isSubmitting ? "Creating..." : "Create DAO"}
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
  console.error("DaoCreate Error:", error);
  return <div className="text-red-600 p-8">An error occurred: {error.message}</div>;
}

export function HydrateFallback() {
  return <div className="p-8">Loading DAO creation form...</div>;
} 