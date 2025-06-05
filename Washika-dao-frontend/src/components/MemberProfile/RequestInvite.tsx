import { useState } from "react";
import DaoForm from "../DaoForm";
import { useReadContract } from "thirdweb/react";
import { FullDaoContract } from "../../utils/handlers/Handlers";
import React from "react";

interface RequestInviteProps {
  showForm: boolean;
  handleAddMemberClick: () => void;
}

const RequestInvite: React.FC<RequestInviteProps> = ({
  showForm,
  handleAddMemberClick,
}) => {
  const [, setDaoToJoinId] = useState<string>("");

  // on-chain: read all DAOs
  const { data: rawDaos } = useReadContract({
    contract: FullDaoContract,
    method:
      "function getDaosInPlatformArr() view returns ((string,string,string,string,address,bytes32)[])",
  });

  const daos = React.useMemo(() => {
    if (!rawDaos) return [];
    return (
      rawDaos as Array<[string, string, string, string, string, string]>
    ).map(([daoName, , , , , daoIdBytes]) => ({
      daoName,
      daoId: daoIdBytes,
    }));
  }, [rawDaos]);

  const handleDaoChange = (
    event: React.ChangeEvent<
      HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const selectedDaoName = event.target.value;

    // Find the selected DAO in the list based on its name
    const chosenDao = daos.find((dao) => dao.daoName === selectedDaoName);

    if (chosenDao) {
      setDaoToJoinId(chosenDao.daoId); // Save selected DAO’s address
    }
  };

  return (
    <>
      {showForm && (
        <div className=" popupp">
          <form>
            <DaoForm
              className="form"
              title="Apply to be a Member"
              description=""
              fields={[
                {
                  label: "email",
                  type: "email",
                },
                {
                  label: "Select Dao",
                  type: "select",
                  options: [
                    {
                      label: "Select Dao",
                      value: "",
                      disabled: true,
                      selected: true,
                    },
                    ...daos.map((dao) => ({
                      label: dao.daoName,
                      value: dao.daoName,
                    })),
                  ],
                  onChange: handleDaoChange,
                },
              ]}
            />
            <div className="center">
              <button className="createAccount" type="submit">
                Submit
              </button>
              <button
                className="closebtn"
                type="button"
                onClick={handleAddMemberClick}
              >
                Close
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default RequestInvite;
