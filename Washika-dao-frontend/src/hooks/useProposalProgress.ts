// useProposalProgress.ts
import { useEffect, useState } from "react";
import { ProposalData } from "./useProposalForm";

export const useProposalProgress = (proposalData: ProposalData, daoMultiSigAddr: string) => {
  const [completedSteps, setCompletedSteps] = useState<number>(0);

  useEffect(() => {
    let stepsCompleted = 0;
    if (daoMultiSigAddr) stepsCompleted++;
    if (proposalData.amountRequested) stepsCompleted++;
    if (proposalData.proposalTitle) stepsCompleted++;
    if (proposalData.proposalDescription) stepsCompleted++;
    if (proposalData.fileUrl) stepsCompleted++;
    setCompletedSteps(stepsCompleted);
  }, [
    daoMultiSigAddr,
    proposalData.amountRequested,
    proposalData.proposalTitle,
    proposalData.proposalDescription,
    proposalData.fileUrl,
  ]);

  return completedSteps;
};
