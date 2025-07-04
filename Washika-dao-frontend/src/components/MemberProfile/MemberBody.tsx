import React from "react";
import Dashboard from "../Dashboard.js";
import ProposalGroups from "../Proposals/ProposalGroups.js";

interface MemberBodyProps {
  memberAddr: string;
}

const MemberBody: React.FC<MemberBodyProps> = ({ memberAddr }) => {
  return (
    <div className="member-body">
      <Dashboard address={memberAddr} />
      <ProposalGroups ownerFilter={memberAddr} />
    </div>
  );
};

export default MemberBody;
