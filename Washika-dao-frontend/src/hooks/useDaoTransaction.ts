import { useState } from "react";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import { prepareContractCall } from "thirdweb";
import { FullDaoContract } from "../utils/handlers/Handlers";
import { IBackendDaoCreation } from "../utils/Types";

export const useDaoTransaction = () => {
  const [daoTxHash, setDaoTxHash] = useState<string>("");
  const currActiveAcc = useActiveAccount();
  const { mutate: sendTx } = useSendTransaction();

  const prepareCreateDaoTx = (
    formData: IBackendDaoCreation,
    _multiSigPhoneNo: bigint
  ) => {
    if (!currActiveAcc) {
      console.error("Fatal Error, No Active Account found");
      return null;
    }

    try {
      console.log("Preparing DAO Creation transaction");
      const _createDaotx = prepareContractCall({
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
          BigInt(_multiSigPhoneNo?.toString() ?? "0"), // Convert to BigInt and handle undefined
        ],
      });
      console.log("Dao Creation transaction prepared", _createDaotx);
      return _createDaotx;
    } catch (error) {
      console.error("Error preparing transaction:", error);
      return null;
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sendCreateDaoTx = async (_createDaotx: any): Promise<string | null> => {
    if (!_createDaotx) {
      console.warn("Undefined transaction");
      return null;
    }

    return new Promise<string | null>((resolve) => {
      console.log("Sending transaction...");
      alert("Sending transaction...");

      sendTx(_createDaotx, {
        onSuccess: (receipt) => {
          console.log("Transaction successful!", receipt);
          setDaoTxHash(receipt.transactionHash);
          resolve(receipt.transactionHash);
        },
        onError: (error) => {
          if (error instanceof Error && error.message.includes("AA21")) {
            prompt(
              "Gas sponsorship issue, please top up your account or request for gas sponsorship"
            );
          } else {
            console.error("Error creating dao", error);
          }
          resolve(null);
        },
      });
    });
  };

  const handleCreateDao = async (
    formData: IBackendDaoCreation
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

    try {
      //Converting multisigPhoneNo to BigInt with default value
      const multisigPhoneNoBigInt = BigInt(formData.multiSigPhoneNo || "0");
      console.log(
        "Phone number to bind to multisig for dao",
        multisigPhoneNoBigInt
      );
      console.log("------------Now Calling prepareCreateDaoTx------------");
      const finalTx = prepareCreateDaoTx(formData, multisigPhoneNoBigInt);
      if (finalTx) {
        const txHash = await sendCreateDaoTx(finalTx);
        console.log("Transaction sent successfully");
        return txHash;
      } else {
        console.log("Looks like transaction failed");
        return null;
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes("AA21")) {
        prompt(
          "Gas sponsorship issue, please top up your account or request for gas sponsorship"
        );
      } else {
        console.error("Error creating dao", error);
      }
      return null;
    }
  };

  return { daoTxHash, handleCreateDao };
};
