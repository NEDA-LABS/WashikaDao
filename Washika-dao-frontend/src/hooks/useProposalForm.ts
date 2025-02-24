// useProposalForm.ts
import { useState } from "react";
import { useCloudinaryUpload } from "./useCloudinaryUpload";

export interface ProposalData {
  proposalCustomIdentifier: string;
  proposalOwner: string | null;
  otherMember: string;
  proposalTitle: string;
  proposalSummary: string;
  proposalDescription: string;
  proposalStatus: string;
  amountRequested: string;
  profitSharePercent: string;
  daoMultiSigAddr: string;
  numUpvotes: number;
  numDownvotes: number;
  proposalDuration: number;
  fileUrl: string;
}

export const useProposalForm = (
  memberAddr: string | null,
  daoMultiSigAddr: string
) => {
  const { uploadFileToCloudinary } = useCloudinaryUpload();
  const [proposalData, setProposalData] = useState<ProposalData>({
    proposalCustomIdentifier: crypto.randomUUID(),
    proposalOwner: memberAddr,
    otherMember: "",
    proposalTitle: "",
    proposalSummary: "",
    proposalDescription: "",
    proposalStatus: "open",
    amountRequested: "",
    profitSharePercent: "",
    daoMultiSigAddr: daoMultiSigAddr,
    numUpvotes: 0,
    numDownvotes: 0,
    proposalDuration: 6000,
    fileUrl: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setProposalData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Uses the default "raw" resource type.
      const fileUrl = await uploadFileToCloudinary(file);
      if (fileUrl) {
        setProposalData((prevData) => ({
          ...prevData,
          fileUrl: fileUrl,
        }));
      }
    }
  };

  return { proposalData, setProposalData, handleChange, handleFileChange };
};
