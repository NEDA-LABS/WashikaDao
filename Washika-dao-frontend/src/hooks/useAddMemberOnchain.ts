// src/hooks/useAddMemberOnchain.ts
import { useSendTransaction } from "thirdweb/react";
import { prepareContractCall, PreparedTransaction } from "thirdweb";
import { FullDaoContract } from "../utils/handlers/Handlers.js";

export function useAddMemberOnchain() {
  const { mutateAsync: sendTransaction } = useSendTransaction();

  /**
   * Calls the addMemberToDao function on-chain.
   * @param memberEmail user's email
   * @param memberAddress on-chain address to add
   * @param daoId the bytes32 DAO id
   */
  async function addMemberToDaoOnchain(
    memberEmail: string,
    memberAddress: string,
    daoId: `0x${string}`
  ) {
    const tx = prepareContractCall({
      contract: FullDaoContract,
      method:
        "function addMemberToDao(string _memberEmail, address _memberAddress, bytes32 _daoId)",
      params: [memberEmail, memberAddress, daoId],
    }) as PreparedTransaction;

    return sendTransaction(tx, {
      onSuccess(receipt) {
        console.log("✅ on-chain member added:", receipt.transactionHash);
      },
      onError(err) {
        console.error("❌ on-chain member addition failed:", err);
        throw err;
      },
    });
  }

  return { addMemberToDaoOnchain };
}
