import { useState } from "react";

import {  IBackendDaoCreatorDetails, IBackendDaoMember } from "../utils/Types.ts";

export const useMemberManagement = () => {
  const [members, setMembers] = useState<IBackendDaoMember[]>([]);
  const [currentMember, setCurrentMember] = useState<IBackendDaoMember>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    nationalIdNo: "",
    memberRole: "",
    memberCustomIdentifier: crypto.randomUUID(),
  });

  const [daoCreatorDetails, setDaoCreatorDetails] = useState<IBackendDaoCreatorDetails>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    nationalIdNo: "",
    memberRole: "",
    daoCreatorAddress:  ""
  })

  const handleMemberChange = (
    field: keyof IBackendDaoMember,
    value: string
  ) => {
    setCurrentMember((prev) => ({ ...prev, [field]: value }));
  };

  const isValidMember = (member: IBackendDaoMember) => {
    return Object.values(member).every((value) => value);
  };

  const handleDaoCreatorValueChange = (
    field: keyof IBackendDaoCreatorDetails,
    value: string
  ) => {
    setDaoCreatorDetails((prev) => ({ ...prev, [field]: value }));
  }
  const handleAddMember = async () => {
    if (!isValidMember(currentMember)) return;

    setMembers([...members, currentMember]);
    setCurrentMember({
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      nationalIdNo: "",
      memberRole: "",
      memberCustomIdentifier: crypto.randomUUID(),
    });
  };
  const handleAddDaoCreatorDetails = () => {
    setDaoCreatorDetails({
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      nationalIdNo: "",
      memberRole: "",
      daoCreatorAddress: "",
    });
  }

  return {
    members,
    currentMember,
    daoCreatorDetails,
    handleMemberChange,
    handleAddMember,
    handleDaoCreatorValueChange,
    handleAddDaoCreatorDetails
  };
};
