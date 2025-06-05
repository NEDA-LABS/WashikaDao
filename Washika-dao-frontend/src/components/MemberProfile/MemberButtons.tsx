import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface MemberButtonsProps {
  handleAddMemberClick: () => void;
  setShowStatement: (value: boolean) => void;
  setShowPaymentModal: (value: boolean) => void;
}


const MemberButtons: React.FC<MemberButtonsProps> = ({
  handleAddMemberClick,
  setShowStatement,
  setShowPaymentModal,
}) => {

  const navigate = useNavigate();
  const [activeButton, setActiveButton] = useState<string>(
    "Account Information"
  );
  const handleClick = () => navigate("/CreateProposal");
  return (
    <>
      <div className="button-group buttons">
        <button
          className={activeButton === "Account Information" ? "active" : ""}
          onClick={() => {
            setActiveButton("Account Information");
            setShowStatement(true);
          }}
        >
          Account Information
        </button>
        <button
          className={activeButton === "Make Payments" ? "active" : ""}
          onClick={() => {
            setActiveButton("Make Payments");
            setShowPaymentModal(true);
          }}
        >
          Make Payments
        </button>
        <button
          className={activeButton === "Apply for Loan" ? "active" : ""}
          onClick={() => {
            setActiveButton("Apply for Loan");
            handleClick();
          }}
        >
          Apply for Loan
        </button>
        <button
          className={activeButton === "Request Invite" ? "active" : ""}
          onClick={() => {
            setActiveButton("Request Invite");
            handleAddMemberClick();
          }}
        >
          Request Invite
        </button>
      </div>
    </>
  );
};

export default MemberButtons;
