import { useEffect, useState } from "react";
import { IBackendDaoCreation } from "../utils/Types"; 

export const useCompletedSteps = (
  formData: IBackendDaoCreation,
  // members: IBackendDaoMember[],
  memberAddr: string | null
) => {
  const [completedSteps, setCompletedSteps] = useState<number>(0);

  useEffect(() => {
    let stepsCompleted = 0;

    if (memberAddr) stepsCompleted++;
    if (formData.daoName) stepsCompleted++;
    if (formData.targetAudience) stepsCompleted++;
    if (formData.daoLocation) stepsCompleted++;
    if (formData.daoDescription) stepsCompleted++;

    setCompletedSteps(stepsCompleted);
  }, [formData, memberAddr]);

  return completedSteps;
};
