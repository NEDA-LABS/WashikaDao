import { useState } from "react";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import { prepareContractCall } from "thirdweb";
import { FullDaoContract } from "../utils/handlers/Handlers";
import { IBackendDaoMember } from "../utils/Types";

export const useMemberTransaction = () => {
  const [memberTxHash, setMemberTxHash] = useState<string>("");
  const currActiveAcc = useActiveAccount();
  const { mutate: sendTx } = useSendTransaction();

  const buildRegisterMemberTransaction = (currentMember: IBackendDaoMember) => {
    if (!currActiveAcc) {
      console.error("Fatal Error, No Active Account found");
      return null;
    }

    try {
      console.debug("Preparing Member Registration transaction...");
      return prepareContractCall({
        contract: FullDaoContract,
        method: "addMember",
        params: [
          currentMember.firstName,
          currentMember.email,
          BigInt(currentMember.phoneNumber),
          BigInt(currentMember.nationalIdNo),
          currentMember.memberRole,
          currentMember.memberAddr,
          currActiveAcc.address,
          currentMember.multiSigPhoneNo,
        ],
      });
    } catch (error) {
      console.error("Error preparing transaction:", error);
      return null;
    }
  };

  const executeRegisterMemberTransaction = async (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    transaction: any,
    currentMember: IBackendDaoMember,
    callback?: (member: IBackendDaoMember, txHash: string) => void
  ): Promise<string | null> => {
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
          setMemberTxHash(receipt.transactionHash);
          if (callback) {
            callback(currentMember, receipt.transactionHash);
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
      console.error("Error registering member:", error);
      throw error;
    }
  };

  const generateDummyTxHash = (): string =>
    `0x${Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("")}`;

  const handleRegisterMember = async (
    currentMember: IBackendDaoMember,
    callback?: (member: IBackendDaoMember, txHash: string) => void
  ): Promise<string | null> => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    if (import.meta.env.VITE_SKIP_ONCHAIN === "true") {
      const dummyTxHash = generateDummyTxHash();
      console.log(
        "Skipping on-chain transaction; using dummy tx hash:",
        dummyTxHash
      );
      if (callback) {
        callback(currentMember, dummyTxHash);
      }
      return dummyTxHash;
    }

    try {
      console.debug("Calling buildRegisterMemberTransaction...");
      const finalTx = buildRegisterMemberTransaction(currentMember);
      return finalTx ? await executeRegisterMemberTransaction(finalTx, currentMember, callback) : null;
    } catch (error) {
      handleTransactionError(error);
      return null;
    }
  };

  return { memberTxHash, handleRegisterMember };
};
