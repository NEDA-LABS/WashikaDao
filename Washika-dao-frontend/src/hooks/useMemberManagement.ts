import { useState } from "react";
import { IBackendDaoMember } from "../utils/Types.ts";
import { baseUrl } from "../utils/backendComm.ts";

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

  const handleAddAndInviteMember = async () => {
    if (!isValidMember(currentMember)) return;

    setMembers([...members, currentMember]);

    try {
      const token = localStorage.getItem("token") ?? "";
      console.log('this is the token', token);
      
      const response = await fetch(
        `http://${baseUrl}/DaoKit/MemberShip/InviteMemberEmail`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            email: currentMember.email,
            firstName: currentMember.firstName,
            member: currentMember.memberCustomIdentifier,
          }),
        }
      );

      if (response.ok) {
        alert("Member added and email sent successfully.");
      } else {
        console.error("Failed to send email.");
      }
    } catch (error) {
      console.error("Error:", error);
    }

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
    handleAddAndInviteMember,
  };
};
