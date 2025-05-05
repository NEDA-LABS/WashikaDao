import { useState } from "react";
import {  IBackendDaoMember } from "../utils/Types.ts";
import { prepareContractCall, PreparedTransaction } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";
import { FullDaoContract } from "../utils/handlers/Handlers";



export const useMemberManagement = ( daoId: `0x${string}` | undefined,
  // token: string,
  adminAddress: string | undefined,
  notify: (type: "success" | "error", message: string) => void) => {
  const [currentMember, setCurrentMember] = useState<IBackendDaoMember>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    nationalIdNo: "",
    memberRole: "",
    memberCustomIdentifier: crypto.randomUUID(),
    memberAddr: ""
  });

  const handleMemberChange = (
    field: keyof IBackendDaoMember,
    value: string
  ) => {
    setCurrentMember((prev) => ({ ...prev, [field]: value }));
  };

  // const isValidMember = (member: IBackendDaoMember) => {
  //   return Object.values(member).every((value) => value);
  // };

  const { mutate: sendTx } = useSendTransaction();
  
  const handleAddMember = () => {
    // 1) validate
    if (!currentMember.email) {
      return notify("error", "Please fill in email.");
    }
    if (!daoId) {
      return notify("error", "DAO ID not available.");
    }
    if (!adminAddress) {
      return notify("error", "Your wallet must be connected.");
    }

    // 2) fire the on-chain tx
    const tx = prepareContractCall({
      contract: FullDaoContract,
      method:
        "function addMemberToDao(string _memberEmail, address _memberAddress, bytes32 _daoId)",
      params: [
        // pass the email you collected
        currentMember.email,
        // the address of the member you're adding:
        currentMember.memberAddr,
        // the DAO ID (bytes32):
        daoId,
      ],
    }) as PreparedTransaction;

    sendTx(tx, {
      onSuccess: (receipt) => {
        notify(
          "success",
          `Successfully added ${currentMember.email} on‐chain!`
        );
        console.log(receipt);
        // reset form
        setCurrentMember({
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          nationalIdNo: "",
          memberRole: "",
          memberCustomIdentifier: crypto.randomUUID(),
          memberAddr: ""
        });
      },
      onError: (err) => {
        console.error(err);
        notify("error", "On-chain addMemberToDao failed");
      },
    });
  };


  return {
    currentMember,
    handleMemberChange,
    handleAddMember,
  };
};