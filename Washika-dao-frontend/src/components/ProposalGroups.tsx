import { useNavigate } from "react-router-dom";

interface ProposalData {
  title: string;
  status: "Rejected" | "In progress"; 
  description: string;
  amountRequested: string;
  currency: string;
}
/**
 * A React functional component that displays a list of proposal groups.
 * Each proposal includes a title, status, description, requested amount, and currency.
 * The component allows users to navigate to a detailed view of each proposal
 * by clicking on the "Vote on Proposal" or "View linked resources" buttons.
 * 
 * @returns A JSX element containing a list of proposals with their details and navigation buttons.
 */
const ProposalGroups: React.FC = () => {
  const navigate =useNavigate();

  const handleProposalClick = () => {
    navigate('/viewProposal')
  }
  const proposalData: ProposalData[] = [
    {
      title: "Proposal for Buying new spare part of machinery",
      status: "Rejected",
      description:
        "We are Nipe Fagio, an environmental non-profit organization committed to cleaning and preserving our beaches. Our goal is to collect and remove at least 10 tons of plastic waste through community clean-up events and outreach programs.",
      amountRequested: "3,000,000",
      currency: "Tsh",
    },
    {
      title: "Proposal for Beach clean up - msasani to Mbezi",
      status: "In progress",
      description:
        "We are Nipe Fagio, an environmental non-profit organization committed to cleaning and preserving our beaches. Our goal is to collect and remove at least 10 tons of plastic waste through community clean-up events and outreach programs.",
      amountRequested: "500,000",
      currency: "Tsh",
    },
  ];

  return (
    <div className="proposal-groups">
      {proposalData.map((proposal, index) => (
        <div className="proposal" key={index}>
          <div className="one">
            <h1>{proposal.title}</h1>
            <div
              className={
                proposal.status === "Rejected" ? "rejected" : "inProgress"
              }
            >
              {proposal.status}
            </div>
          </div>
          <p className="two">{proposal.description}</p>
          <div className="three">
            <div className="button-group button">
              <button onClick={handleProposalClick}>Vote on Proposal</button>
              <button className="button-2" onClick={handleProposalClick}>View linked resources</button>
            </div>
            <div className="proposal-right">
              <h2>Amount Requested</h2>
              <p>
                {proposal.amountRequested}
                <span>{proposal.currency}</span>
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProposalGroups;
