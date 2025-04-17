import React from "react";
import MemberForm from "../MemberForm";
import { IBackendDaoMember } from "../../utils/Types";

export interface Step3MembersProps {
  currentMember: IBackendDaoMember;
  onMemberChange: (
    field: keyof IBackendDaoMember,
    value: string
  ) => void;
  onAddMember: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const Step3Members: React.FC<Step3MembersProps> = ({
  currentMember,
  onMemberChange,
  onAddMember,
  onSubmit,
  isSubmitting,
}) => (
  <div className="step step3">
    <MemberForm
      currentMember={currentMember}
      onMemberChange={onMemberChange}
      onAddMember={onAddMember}
    />
    <center>
      <button
        disabled={isSubmitting}
        className={`createDao ${isSubmitting ? "loading" : ""}`}
        onClick={onSubmit}
      >
        Create Account
      </button>
    </center>
  </div>
);

export default Step3Members;
