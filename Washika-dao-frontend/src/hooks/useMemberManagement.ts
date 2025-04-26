import { useState } from "react";
import {
  BASE_BACKEND_ENDPOINT_URL,
  ROUTE_PROTECTOR_KEY,
} from "../utils/backendComm";
import {  IBackendDaoCreatorDetails, IBackendDaoMember } from "../utils/Types.ts";

export const useMemberManagement = ( multiSigAddr: string | undefined,
  token: string,
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
    if (!isValidMember(currentMember)) {
      notify("error", "Please fill in all member fields.");
      return;
    }

    try {
      const response = await fetch(
        `${BASE_BACKEND_ENDPOINT_URL}/DaoKit/MemberShip/AddMember/?daoTxHash=${multiSigAddr}&adminMemberAddr=${adminAddress}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": ROUTE_PROTECTOR_KEY,
            Authorization: token,
          },
          body: JSON.stringify(currentMember),
        }
      );

      const result = await response.json();

      if (response.ok) {
        notify(
          "success",
          `Invited ${currentMember.firstName} ${currentMember.lastName}`
        );
        setCurrentMember({
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          nationalIdNo: "",
          memberRole: "",
          memberCustomIdentifier: crypto.randomUUID(),
        });
      } else {
        notify("error", result.error || "Failed to invite member");
      }
    } catch (error) {
      notify("error", "Error sending member data.");
      console.error(error);
    }
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
    currentMember,
    daoCreatorDetails,
    handleMemberChange,
    handleAddMember,
    handleDaoCreatorValueChange,
    handleAddDaoCreatorDetails
  };
};