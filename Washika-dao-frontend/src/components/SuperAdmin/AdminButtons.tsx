import { useNavigate, useParams } from "react-router-dom";

interface AdminButtonsProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  setPrevSection: (section: string) => void;
}

export default function AdminButtons({
  activeSection,
  setActiveSection,
  setPrevSection,
}: AdminButtonsProps) {
  const navigate = useNavigate();
  const { multiSigAddr } = useParams<{ multiSigAddr: string }>();

  const handleAddMember = () => {
    setPrevSection(activeSection);
    setActiveSection("addMember");
  };
  return (
    <div className="button-group buttons">
      <button
        onClick={() => setActiveSection("daoOverview")}
        className={activeSection === "daoOverview" ? "active" : ""}
      >
        Dao Overview
      </button>
      <button onClick={handleAddMember}>Add Members</button>
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
  );
}
