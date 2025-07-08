import React from "react";
// Add or import the MsignersFormProps interface if not present
// interface MsignersFormProps { ... }

interface MsignersFormProps {
  currentMember: {
    firstName: string;
    lastName: string;
    memberRole: string;
  };
  onMemberChange: (field: string, value: string) => void;
  onAddMember: () => void;
  isSubmitting: boolean;
  onCancel: () => void;
}

const MsignersForm: React.FC<MsignersFormProps> = (
    {
        currentMember,
        onMemberChange,
        onAddMember,
        isSubmitting,
        onCancel,
    }
) => {
    return (
        <div className="m-signers-form">
            <div className="form-header">
                <h2>Add Multisig Members</h2>
                <button type="button" onClick={onCancel} disabled={isSubmitting}>
                    Cancel
                </button>
            </div>
            <div className="form-body">
                <input
                    type="text"
                    value={currentMember.firstName}
                    onChange={(e) => onMemberChange("firstName", e.target.value)}
                    placeholder="First Name"
                    disabled={isSubmitting}
                />
                <input
                    type="text"
                    value={currentMember.lastName}
                    onChange={(e) => onMemberChange("lastName", e.target.value)}
                    placeholder="Last Name"
                    disabled={isSubmitting}
                />
                <input
                    type="text"
                    value={currentMember.memberRole}
                    onChange={(e) => onMemberChange("memberRole", e.target.value)}
                    placeholder="Role"
                    disabled={isSubmitting}
                />
                <button type="submit" onClick={onAddMember} disabled={isSubmitting}>
                    Add Member
                </button>
            </div>
        </div>
    );
};

export default MsignersForm;