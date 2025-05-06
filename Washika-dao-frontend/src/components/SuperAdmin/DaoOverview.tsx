import Dashboard from "../Dashboard";
import ProposalGroups from "../ProposalGroups";
import TransactionPopup from "./TransactionPopup";
import { DaoDetails } from "./WanachamaList";
import { useState } from "react";

interface DaoOverviewProps {
  daoDetails?: DaoDetails;
}

export default function DaoOverview({ daoDetails }: DaoOverviewProps) {
  const [showStatement, setShowStatement] = useState(false);
  if (!daoDetails) {
    return <div>Loading DAO overview…</div>;
  }
  const daoMultisigAddr = daoDetails!.daoMultiSigAddr;

  return (
    <>
      <div className="dashboard-wrapper">
        <div className="fullStatement">
        <button onClick={() => setShowStatement(true)}>Full Statement</button>
        </div>
        <Dashboard address={daoMultisigAddr} />
      </div>
      <section className="second">
        <div className="sec">
          <img src="/images/Vector4.png" alt="logo" />
          <h1>Current Proposals</h1>
        </div>
        <ProposalGroups />
      </section>
      {showStatement && (
        <div className="modal-overlay" onClick={() => setShowStatement(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
          >
            <TransactionPopup daoDetails={daoDetails} />
            <button onClick={() => setShowStatement(false)} className="close-btn">
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
