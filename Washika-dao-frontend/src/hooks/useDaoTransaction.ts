import { useState } from "react";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import { prepareContractCall } from "thirdweb";
import { FullDaoContract } from "../utils/handlers/Handlers";
import { IBackendDaoCreation } from "../utils/Types";

export const useDaoTransaction = () => {
  const [daoTxHash, setDaoTxHash] = useState<string>("");
  const currActiveAcc = useActiveAccount();
  const { mutate: sendTx } = useSendTransaction();

  const buildCreateDaoTransaction = (formData: IBackendDaoCreation) => {
    if (!currActiveAcc) {
      console.error("Fatal Error, No Active Account found");
      return null;
    }

    try {
      console.debug("Preparing DAO Creation transaction...");
      return prepareContractCall({
        contract: FullDaoContract,
        method:
          "function createDao(string _daoLocation, string _daoObjective, string _daoTargetAudience, string _daoName)",
        params: [
          formData.daoLocation,
          formData.daoDescription,
          formData.targetAudience,
          formData.daoName,
        ],
      });
    } catch (error) {
      console.error("Error preparing transaction:", error);
      return null;
    }
  };

  const executeCreateDaoTransaction = async (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    transaction: any,
    formData: IBackendDaoCreation,
    callback?: (data: IBackendDaoCreation, txHash: string) => void
  ): Promise<string | null> => {
    if (!transaction) {
      console.warn("Undefined transaction");
      throw new Error("Transaction is undefined");
    }

    return new Promise<string | null>((resolve, reject) => {
      console.log("Sending transaction...");
      // alert("Sending transaction...");

      sendTx(transaction, {
        onSuccess: (receipt) => {
          console.log("Transaction successful!", receipt);
          setDaoTxHash(receipt.transactionHash);
          if (callback) {
            callback(formData, receipt.transactionHash);
          }
          resolve(receipt.transactionHash);
        },
        onError: (error) => {
          handleTransactionError(error);
          reject(error);
        },
      });
    });
  };

  const handleTransactionError = (error: unknown) => {
    if (error instanceof Error && error.message.includes("AA21")) {
      prompt(
        "Gas sponsorship issue, please top up your account or request for gas sponsorship"
      );
      throw new Error("Gas sponsorship issue detected");
    } else {
      console.error("Error creating DAO:", error);
      throw error;
    }
  };

  const generateDummyTxHash = (): string =>
    `0x${Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("")}`;

  const handleCreateDao = async (
    formData: IBackendDaoCreation,
    callback?: (data: IBackendDaoCreation, txHash: string) => void
  ): Promise<string | null> => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    if (import.meta.env.VITE_SKIP_ONCHAIN === "true") {
      const dummyTxHash = generateDummyTxHash();
      console.log(
        "Skipping on-chain transaction; using dummy tx hash:",
        dummyTxHash
      );
      return dummyTxHash;
    }

    try {
      console.debug("Calling buildCreateDaoTransaction...");
      const finalTx = buildCreateDaoTransaction(formData);
      return finalTx
        ? await executeCreateDaoTransaction(finalTx, formData, callback)
        : null;
    } catch (error) {
      handleTransactionError(error);
      return null;
    }
  };

  return { daoTxHash, handleCreateDao };
};
