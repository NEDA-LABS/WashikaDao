import Dashboard from "../Dashboard";
import ProposalGroups from "../ProposalGroups";

export default function DaoOverview() {
  return (
    <>
      <div className="dashboard-wrapper">
        <div className="fullStatement">
          <button>Full Statement</button>
        </div>
        <Dashboard />
      </div>
      <section className="second">
        <div className="sec">
          <img src="/images/Vector4.png" alt="logo" />
          <h1>Current Proposals</h1>
        </div>
        <ProposalGroups />
      </section>
    </>
  );
}
