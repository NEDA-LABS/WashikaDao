import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { Signer } from "ethers";
import { prepareContractCall, readContract, sendTransaction } from "thirdweb";
import { FullDaoContract } from "../utils/handlers/Handlers.js";
// import { ethers } from "ethers"; // If needed for wallet connection

// TODO: Replace with your actual contract address
const CONTRACT_ADDRESS = "YOUR_CONTRACT_ADDRESS";
const CHAIN = "polygon"; // or your chain

// Helper to get a read-only contract instance
export function getReadContract() {
  const sdk = new ThirdwebSDK(CHAIN);
  return sdk.getContract(CONTRACT_ADDRESS);
}

// Helper to get a contract instance with a signer (user context)
export function getUserContract(signer: Signer) {
  const sdk = ThirdwebSDK.fromSigner(signer, CHAIN);
  return sdk.getContract(CONTRACT_ADDRESS);
}

// Loader: get all DAOs (read-only)
export async function getAllDaos() {
  const contract = await getReadContract();
  return await contract.call("getDaosInPlatformArr");
}

// Action: create DAO (user context)
export async function createDao({ name, location, objective, targetAudience }: { name: string, location: string, objective: string, targetAudience: string }, signer: Signer) {
  const contract = await getUserContract(signer);
  // Call the contract's createDao function
  return await contract.call("createDao", [location, objective, targetAudience, name]);
}

/**
 * Add a member to a DAO (creator only)
 * @param memberEmail - Member's email (stored in backend)
 * @param memberAddress - Member's blockchain address (stored on-chain)
 * @param daoId - DAO ID
 * @returns Transaction receipt
 */
export async function addMemberToDao(
  memberEmail: string,
  memberAddress: string,
  daoId: `0x${string}`
) {
  try {
    // @ts-ignore
    const tx = prepareContractCall({
      contract: FullDaoContract,
      method: "function addMemberToDao(string _memberEmail, address _memberAddress, bytes32 _daoId)",
      params: [memberEmail, memberAddress, daoId],
    });
    // @ts-expect-error
    return await sendTransaction(tx);
  } catch (error) {
    console.error("Failed to add member to DAO:", error);
    throw new Error("Failed to add member to DAO");
  }
}

/**
 * Get all members of a DAO
 * @param daoId - DAO ID
 * @returns Array of member details
 */
export async function getDaoMembers(daoId: `0x${string}`) {
  try {
    // @ts-ignore
    const members = await readContract({
      contract: FullDaoContract,
      method: "function getDaoMembers(bytes32 _daoId) view returns ((string memberEmail, address memberAddress)[])",
      params: [daoId],
    });
    return members as Array<{ memberEmail: string; memberAddress: string }>;
  } catch (error) {
    console.error("Failed to get DAO members:", error);
    throw new Error("Failed to get DAO members");
  }
}

/**
 * Check if a user is a member of a DAO
 * @param daoId - DAO ID
 * @param userAddress - User's address
 * @returns Boolean indicating membership
 */
export async function isYMemberOfDaoX(daoId: `0x${string}`, userAddress: string) {
  try {
    // @ts-ignore
    const isMember = await readContract({
      contract: FullDaoContract,
      method: "function isYMemberOfDaoX(bytes32 _daoId, address _userAddress) view returns (bool)",
      params: [daoId, userAddress],
    });
    return isMember as boolean;
  } catch (error) {
    console.error("Failed to check membership:", error);
    throw new Error("Failed to check membership");
  }
}

/**
 * Check if a user is the creator of a DAO
 * @param daoId - DAO ID
 * @param userAddress - User's address
 * @returns Boolean indicating if user is creator
 */
export async function isDaoCreator(daoId: `0x${string}`, userAddress: string) {
  try {
    // @ts-ignore
    const isCreator = await readContract({
      contract: FullDaoContract,
      method: "function isDaoCreator(address _userAddress, bytes32 _daoId) view returns (bool)",
      params: [userAddress, daoId],
    });
    return isCreator as boolean;
  } catch (error) {
    console.error("Failed to check creator status:", error);
    throw new Error("Failed to check creator status");
  }
}

/**
 * Get the latest DAO ID created by a given creator address
 * @param creatorAddress - The creator's wallet address
 * @returns The latest DAO ID (bytes32)
 */
export async function getLatestDaoIdByCreatorX(creatorAddress: string): Promise<`0x${string}`> {
  try {
    // abitype/thirdweb type workaround: ignore type errors for contract call object
    // @ts-ignore
    const daoId = await readContract(
      // @ts-ignore
      {
        contract: FullDaoContract,
        method: "function getLatestDaoIdByCreatorX(address) view returns (bytes32)",
        params: [creatorAddress],
      }
    );
    return daoId as `0x${string}`;
  } catch (error) {
    console.error("Failed to get latest DAO ID by creator:", error);
    throw new Error("Failed to get latest DAO ID by creator");
  }
} 