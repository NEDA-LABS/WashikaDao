import { useEffect, useState } from "react";
import { IBackendDaoCreation, IBackendDaoMember } from "../utils/Types"; 

export const useCompletedSteps = (
  formData: IBackendDaoCreation,
  members: IBackendDaoMember[],
  memberAddr: string | null
) => {
  const [completedSteps, setCompletedSteps] = useState<number>(0);

  useEffect(() => {
    let stepsCompleted = 0;

    if (memberAddr) stepsCompleted++;
    if (formData.daoName) stepsCompleted++;
    if (formData.daoTitle) stepsCompleted++;
    if (formData.daoImageIpfsHash) stepsCompleted++;
    if (members.length > 0) stepsCompleted++;

    setCompletedSteps(stepsCompleted);
  }, [formData, memberAddr, members]);

  return completedSteps;
};
