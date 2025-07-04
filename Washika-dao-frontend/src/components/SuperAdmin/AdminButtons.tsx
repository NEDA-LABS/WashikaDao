import { useNavigate, useParams } from "react-router";

interface AdminButtonsProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export default function AdminButtons({
  activeSection,
  setActiveSection,
}: AdminButtonsProps) {
  const navigate = useNavigate();
  const { multiSigAddr } = useParams<{ multiSigAddr: string }>();

  const handleAddMember = () => {
    setActiveSection("addMember");
  };
  return (
    <>
      <div className="DaoOperations">
        <h1>DAO operations</h1>
      </div>
      <div className="button-group buttons">
        <button
          onClick={() => setActiveSection("daoOverview")}
          className={activeSection === "daoOverview" ? "active" : ""}
        >
          Dao Overview
        </button>
        <button
          onClick={handleAddMember}
          className={activeSection === "addMember" ? "active" : ""}
        >
          Add Members
        </button>
        <button
          onClick={() => setActiveSection("mikopo")}
          className={activeSection === "mikopo" ? "active" : ""}
        >
          Loan Details
        </button>
        <button onClick={() => navigate(`/UpdateDao/${multiSigAddr}`)}>
          Edit Settings
        </button>
      </div>
    </>
  );
}
