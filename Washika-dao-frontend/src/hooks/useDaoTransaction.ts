import { useState } from "react";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import { prepareContractCall } from "thirdweb";
import { FullDaoContract } from "../utils/handlers/Handlers";
import { IBackendDaoCreation } from "../utils/Types";

export const useDaoTransaction = () => {
  const [daoTxHash, setDaoTxHash] = useState<string>("");
  const currActiveAcc = useActiveAccount();
  const { mutate: sendTx } = useSendTransaction();

  const buildCreateDaoTransaction = (
    formData: IBackendDaoCreation,
    multiSigPhoneNo: bigint
  ) => {
    if (!currActiveAcc) {
      console.error("Fatal Error, No Active Account found");
      return null;
    }

    try {
      console.debug("Preparing DAO Creation transaction...");
      return prepareContractCall({
        contract: FullDaoContract,
        method: "createDao",
        params: [
          formData.daoName,
          formData.daoLocation,
          formData.targetAudience,
          formData.daoTitle,
          formData.daoDescription,
          formData.daoOverview,
          formData.daoImageIpfsHash,
          currActiveAcc.address, // Multisig address
          multiSigPhoneNo,
        ],
      });
    } catch (error) {
      console.error("Error preparing transaction:", error);
      return null;
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const executeCreateDaoTransaction = async (transaction: any): Promise<string | null> => {
    if (!transaction) {
      console.warn("Undefined transaction");
      throw new Error("Transaction is undefined");
    }

    return new Promise<string | null>((resolve, reject) => {
      console.log("Sending transaction...");
      alert("Sending transaction...");

      sendTx(transaction, {
        onSuccess: (receipt) => {
          console.log("Transaction successful!", receipt);
          setDaoTxHash(receipt.transactionHash);
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
      prompt("Gas sponsorship issue, please top up your account or request for gas sponsorship");
      throw new Error("Gas sponsorship issue detected");
    } else {
      console.error("Error creating DAO:", error);
      throw error; 
    }
  };

  const generateDummyTxHash = (): string =>
    `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`;

  const handleCreateDao = async (formData: IBackendDaoCreation): Promise<string | null> => {
     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    if (import.meta.env.VITE_SKIP_ONCHAIN === "true") {
      const dummyTxHash = generateDummyTxHash();
      console.log("Skipping on-chain transaction; using dummy tx hash:", dummyTxHash);
      return dummyTxHash;
    }

    try {
      const multiSigPhoneNoBigInt = BigInt(formData.multiSigPhoneNo || "0");
      console.debug("MultiSig Phone No (BigInt):", multiSigPhoneNoBigInt);

      console.debug("Calling buildCreateDaoTransaction...");
      const finalTx = buildCreateDaoTransaction(formData, multiSigPhoneNoBigInt);
      return finalTx ? await executeCreateDaoTransaction(finalTx) : null;
    } catch (error) {
      handleTransactionError(error);
      return null;
    }
  };

  return { daoTxHash, handleCreateDao };
};