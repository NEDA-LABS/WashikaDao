import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  useReadContract,
  useSendTransaction,
  useActiveAccount,
} from "thirdweb/react";
import { prepareContractCall } from "thirdweb";
import { FullDaoContract } from "../utils/handlers/Handlers.js";

// TypeScript interfaces for on-chain data
interface MemberDetails {
  memberEmail: string;
  memberAddress: string;
}

interface DaoDetails {
  daoName: string;
  daoLocation: string;
  daoObjective: string;
  daoTargetAudience: string;
  daoCreator: string;
  daoId: `0x${string}`;
}

export default function MembershipCRUD() {
  const { daoId } = useParams<{ daoId: string }>();
  const account = useActiveAccount();
  const { mutate: sendTx, isPending } = useSendTransaction();
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCreator, setIsCreator] = useState<boolean | null>(null);
  const [isMember, setIsMember] = useState<boolean | null>(null);
  const [newMemberAddress, setNewMemberAddress] = useState("");
  const [newMemberEmail, setNewMemberEmail] = useState("");

  // 1. Fetch DAO details
  // @ts-ignore
  const { data: daoDetails, isLoading: loadingDao } = useReadContract({
    contract: FullDaoContract,
    method: "getDaosInPlatformArr",
    params: [],
  });

  // 2. Check if current user is creator
  // @ts-ignore
  const { data: creatorCheck, isLoading: loadingCreator } = useReadContract({
    contract: FullDaoContract,
    method: "isDaoCreator",
    params: daoId && account?.address ? [account.address, daoId as `0x${string}`] : [],
  });

  // 3. Check if current user is member
  // @ts-ignore
  const { data: memberCheck, isLoading: loadingMember } = useReadContract({
    contract: FullDaoContract,
    method: "isYMemberOfDaoX",
    params: daoId && account?.address ? [daoId as `0x${string}`, account.address] : [],
  });

  // 4. Fetch all members
  // @ts-ignore
  const { data: members, isLoading: loadingMembers } = useReadContract({
    contract: FullDaoContract,
    method: "getDaoMembers",
    params: daoId ? [daoId as `0x${string}`] : [],
  });

  useEffect(() => {
    if (typeof creatorCheck === "boolean") setIsCreator(creatorCheck);
    if (typeof memberCheck === "boolean") setIsMember(memberCheck);
  }, [creatorCheck, memberCheck]);

  // 5. Add member handler
  const handleAddMember = () => {
    setSuccess(null);
    setError(null);
    if (!daoId || !newMemberAddress) {
      setError("Please provide member address");
      return;
    }

    // TODO: Contract Extension - Add council roles (creator, chair, secretary, treasurer, special nominated)
    // TODO: Contract Extension - Enforce only one of each special role per DAO
    // TODO: Contract Extension - Add role parameter to addMemberToDao function
    // TODO: Backend Integration - Store email, phone, nationalId, role details in backend
    
    // @ts-ignore
    const tx = prepareContractCall({
      contract: FullDaoContract,
      method: "addMemberToDao",
      params: [
        newMemberEmail, // This will be stored in backend, not on-chain
        newMemberAddress,
        daoId as `0x${string}`,
      ],
    });
    // @ts-ignore
    sendTx(tx, {
      onSuccess: (receipt) => {
        setSuccess(`Member added successfully! Tx: ${receipt.transactionHash}`);
        setNewMemberAddress("");
        setNewMemberEmail("");
      },
      onError: (err) => {
        setError(err.message || "Failed to add member");
      },
    });
  };

  if (loadingDao || !daoId) {
    return <div className="p-8">Loading DAO details...</div>;
  }

  const currentDao = (daoDetails as DaoDetails[])?.find(d => d.daoId === daoId);

  return (
    <div className="max-w-4xl mx-auto mt-12 p-8">
      <h1 className="text-3xl font-bold mb-8">DAO Membership Management</h1>
      
      {/* DAO Info */}
      {currentDao && (
        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">{currentDao.daoName}</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="font-medium">Location:</span> {currentDao.daoLocation}</div>
            <div><span className="font-medium">Creator:</span> {currentDao.daoCreator}</div>
            <div><span className="font-medium">Objective:</span> {currentDao.daoObjective}</div>
            <div><span className="font-medium">Target Audience:</span> {currentDao.daoTargetAudience}</div>
          </div>
        </div>
      )}

      {/* User Status */}
      <div className="bg-blue-50 p-4 rounded-lg mb-8">
        <h3 className="font-semibold mb-2">Your Status</h3>
        {loadingCreator || loadingMember ? (
          <div>Checking your status...</div>
        ) : (
          <div className="space-y-1">
            <div>Creator: {isCreator ? "✅ Yes" : "❌ No"}</div>
            <div>Member: {isMember ? "✅ Yes" : "❌ No"}</div>
          </div>
        )}
      </div>

      {/* Add Member Form (Creator Only) */}
      {isCreator && (
        <div className="bg-white border rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">Add New Member</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Member Email (Backend)</label>
              <input
                type="email"
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="member@example.com"
              />
              <p className="text-xs text-gray-500 mt-1">Email will be stored in backend, not on-chain</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Member Address (On-chain)</label>
              <input
                type="text"
                value={newMemberAddress}
                onChange={(e) => setNewMemberAddress(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="0x..."
              />
              <p className="text-xs text-gray-500 mt-1">Address will be stored on-chain</p>
            </div>
            <button
              onClick={handleAddMember}
              disabled={isPending || !newMemberAddress}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isPending ? "Adding..." : "Add Member"}
            </button>
          </div>
        </div>
      )}

      {/* Success/Error Messages */}
      {success && <div className="bg-green-100 text-green-800 p-4 mb-4 rounded">{success}</div>}
      {error && <div className="bg-red-100 text-red-800 p-4 mb-4 rounded">{error}</div>}

      {/* Members List */}
      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">DAO Members</h3>
        {loadingMembers ? (
          <div>Loading members...</div>
        ) : members && (members as MemberDetails[]).length > 0 ? (
          <div className="space-y-3">
            {(members as MemberDetails[]).map((member, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <div className="font-medium">{member.memberAddress}</div>
                  <div className="text-sm text-gray-600">{member.memberEmail}</div>
                </div>
                <div className="text-xs text-gray-500">
                  {/* TODO: Show council role when contract is extended */}
                  Member
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500">No members found</div>
        )}
      </div>

      {/* TODO Section */}
      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h4 className="font-semibold text-yellow-800 mb-2">Contract Extension TODOs</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Add council roles: creator, chair, secretary, treasurer, special nominated</li>
          <li>• Enforce only one of each special role per DAO</li>
          <li>• Add role parameter to addMemberToDao function</li>
          <li>• Store email, phone, nationalId in backend only</li>
          <li>• Implement 3-of-5 multisig for governing council</li>
        </ul>
      </div>
    </div>
  );
} 