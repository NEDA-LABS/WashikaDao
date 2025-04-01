import { useEffect, useState } from "react";

import { IBackendDaoMember } from "../utils/Types.ts";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store.ts";


export const useMemberManagement = () => {
  const reduxMemberAddr = useSelector((state: RootState) => state.auth.address);
  const [currentMember, setCurrentMember] = useState<IBackendDaoMember>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    nationalIdNo: "",
    memberRole: "Chairperson",
    memberCustomIdentifier: crypto.randomUUID(),
    memberAddr: reduxMemberAddr || "",
    multiSigPhoneNo: BigInt("0")
  });

  // const [daoCreatorDetails, setDaoCreatorDetails] = useState<IBackendDaoCreatorDetails>({
  //   firstName: "",
  //   lastName: "",
  //   email: "",
  //   phoneNumber: "",
  //   nationalIdNo: "",
  //   memberRole: "",
  //   daoCreatorAddress:  ""
  // })

  useEffect(() => {
    if (reduxMemberAddr) {
      setCurrentMember((prev) => ({ ...prev, memberAddr: reduxMemberAddr }));
    }
  }, [reduxMemberAddr]);

  useEffect(() => {
    // Only update if phoneNumber is not empty and is a valid number.
    if (currentMember.phoneNumber && !isNaN(Number(currentMember.phoneNumber))) {
      setCurrentMember((prev) => ({
        ...prev,
        multiSigPhoneNo: BigInt(currentMember.phoneNumber)
      }));
    }
  }, [currentMember.phoneNumber]);

  const handleMemberChange = (
    field: keyof IBackendDaoMember,
    value: string
  ) => {
    setCurrentMember((prev) => ({ ...prev, [field]: value }));
  };

  const isValidMember = (member: IBackendDaoMember) => {
    return member.firstName && member.lastName && member.email && member.phoneNumber && member.nationalIdNo;
  };

  const saveMember = async () => {
    if (!isValidMember(currentMember)) {
      alert("Please fill in all required fields.");
      return false;
    }
    return true;
  };

  // const handleDaoCreatorValueChange = (
  //   field: keyof IBackendDaoCreatorDetails,
  //   value: string
  // ) => {
  //   setDaoCreatorDetails((prev) => ({ ...prev, [field]: value }));
  // }
  // const handleAddMember = async () => {
  //   if (!isValidMember(currentMember)) return;

  //   setMembers([...members, currentMember]);
  //   setCurrentMember({
  //     firstName: "",
  //     lastName: "",
  //     email: "",
  //     phoneNumber: "",
  //     nationalIdNo: "",
  //     memberRole: "",
  //     memberCustomIdentifier: crypto.randomUUID(),
  //     memberAddr: "",
  //     multiSigPhoneNo: BigInt("")
  //   });
  // };
  // const handleAddDaoCreatorDetails = () => {
  //   setDaoCreatorDetails({
  //     firstName: "",
  //     lastName: "",
  //     email: "",
  //     phoneNumber: "",
  //     nationalIdNo: "",
  //     memberRole: "",
  //     daoCreatorAddress: "",
  //   });
  // }

  return {
    currentMember,
    handleMemberChange,
    saveMember
  };
};
