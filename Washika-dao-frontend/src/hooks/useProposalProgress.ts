// useProposalProgress.ts
import { useEffect, useState } from "react";
import { ProposalData } from "./useProposalForm.ts";

export const useProposalProgress = (proposalData: ProposalData, daoCreator: string) => {
  const [completedSteps, setCompletedSteps] = useState<number>(0);

  useEffect(() => {
    let stepsCompleted = 0;
    if (daoCreator) stepsCompleted++;
    // if (proposalData.amountRequested) stepsCompleted++;
    if (proposalData.proposalTitle) stepsCompleted++;
    // if (proposalData.proposalDescription) stepsCompleted++;
    if (proposalData.proposalUrl) stepsCompleted++;
    setCompletedSteps(stepsCompleted);
  }, [
    daoCreator,
    // proposalData.amountRequested,
    proposalData.proposalTitle,
    // proposalData.proposalDescription,
    proposalData.proposalUrl,
  ]);

  return completedSteps;
};
