import { useEffect, useState } from "react";
import { useActiveAccount } from "thirdweb/react";
import { useDaoForm } from "./useDaoForm";
import { useMemberManagement } from "./useMemberManagement";

export const useCompletedSteps = () => {
  const [completedSteps, setCompletedSteps] = useState<number>(0);
  const currUsrAcc = useActiveAccount();
  const memberAddr = currUsrAcc?.address;
  const { formData } = useDaoForm();
  const { members } = useMemberManagement();

  useEffect(() => {
    let stepsCompleted = 0;

    if (memberAddr) stepsCompleted++;
    if (formData.daoName) stepsCompleted++;
    if (formData.daoTitle) stepsCompleted++;
    if (formData.daoImageIpfsHash) stepsCompleted++;
    if (members.length > 0) stepsCompleted++;

    setCompletedSteps(stepsCompleted);
  }, [formData, memberAddr, members.length]);

  return completedSteps;
};
