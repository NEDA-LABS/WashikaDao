// useProposalTransaction.ts
import { useSendTransaction, useActiveAccount } from "thirdweb/react";
import { prepareContractCall, PreparedTransaction } from "thirdweb";
import { FullDaoContract } from "../utils/handlers/Handlers";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useProposalTransaction = (proposalData: any) => {
  const currActiveAcc = useActiveAccount();
  const { mutate: sendTx } = useSendTransaction();

  /**
   * Prepares a blockchain transaction for creating a new proposal.
   *
   * Constructs a contract call using the FullDaoContract and required parameters.
   *
   * @param _daoMultiSigAddr - The multisig address for the DAO.
   * @returns The prepared transaction object, or null if no active account is found.
   */
  const prepareCreateProposalTx = (
    _daoMultiSigAddr: string
  ): PreparedTransaction | null => {
    if (!currActiveAcc) {
      console.error("Fatal Error, No Active Account found");
      return null;
    }
    try {
      console.log("Preparing Proposal Creation Transaction");
      const _createProposaltx = prepareContractCall({
        contract: FullDaoContract,
        method: "addProposal",
        params: [
          _daoMultiSigAddr,
          proposalData.proposalTitle,
          proposalData.proposalSummary,
          proposalData.proposalDescription,
          BigInt(proposalData.proposalDuration),
        ],
      }) as PreparedTransaction;
      console.log("Proposal Creation transaction prepared", _createProposaltx);
      return _createProposaltx;
    } catch (error) {
      console.error("Error Preparing Transaction:", error);
      return null;
    }
  };

  /**
   * Sends the prepared proposal creation transaction to the blockchain.
   *
   * Utilizes the useSendTransaction hook to send the transaction, then handles
   * success and error responses accordingly.
   *
   * @param _createProposaltx - The prepared transaction object.
   * @returns A promise resolving to the transaction hash or null if the transaction fails.
   */
  const sendCreateProposalTx = async (
    _createProposaltx: PreparedTransaction
  ): Promise<string | null> => {
    if (!_createProposaltx) {
      console.warn("Undefined transaction");
      return null;
    }

    return new Promise<string | null>((resolve) => {
      console.log("Sending transaction...");
      sendTx(_createProposaltx, {
        onSuccess: (receipt) => {
          console.log("Transaction successful!", receipt);
          resolve(receipt.transactionHash);
        },
        onError: (error) => {
          if (error.message.includes("AA21")) {
            prompt(
              "Gas sponsorship issue, please top up your account or request sponsorship."
            );
          } else {
            console.error("Error Creating Proposal", error);
          }
          resolve(null);
        },
      });
    });
  };

  /**
   * Handles the creation of a proposal by preparing and sending the transaction.
   *
   * If the DAO multisig address is available, it prepares the transaction and sends it.
   * Logs and returns the transaction hash upon success.
   *
   * @returns The transaction hash if the proposal creation is successful, otherwise null.
   */
  const handleCreateProposal = async (
    daoMultiSigAddr: string
  ): Promise<string | null> => {
    // If we're testing and want to skip the onchain transaction,
    // simply return a dummy transaction hash.
    function generateDummyTxHash(): string {
      // Generate a 64-character hexadecimal string (like a real Ethereum tx hash)
      const randomHex = Array.from({ length: 64 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join("");
      return `0x${randomHex}`;
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    if (import.meta.env.VITE_SKIP_ONCHAIN === "true") {
      const dummyTxHash = generateDummyTxHash();
      console.log(
        "Skipping onchain transaction; using dummy tx hash:",
        dummyTxHash
      );
      return dummyTxHash;
    }

    if (daoMultiSigAddr) {
      const finalTx = prepareCreateProposalTx(daoMultiSigAddr);
      if (finalTx) {
        const txHash = await sendCreateProposalTx(finalTx);
        console.log("Transaction sent successfully");
        return txHash;
      } else {
        console.log("Transaction preparation failed");
        return null;
      }
    }
    return null;
  };

  return { handleCreateProposal };
};
