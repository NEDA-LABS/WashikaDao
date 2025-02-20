import { useState } from "react";
import { IBackendDaoMember } from "../utils/Types.ts";

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

  const handleMemberChange = (
    field: keyof IBackendDaoMember,
    value: string
  ) => {
    setCurrentMember((prev) => ({ ...prev, [field]: value }));
  };

  const isValidMember = (member: IBackendDaoMember) => {
    return Object.values(member).every((value) => value);
  };

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

  return {
    members,
    currentMember,
    handleMemberChange,
    handleAddMember,
  };
};
