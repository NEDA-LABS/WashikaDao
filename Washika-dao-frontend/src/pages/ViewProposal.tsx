import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import { useNavigate, useParams } from "react-router-dom";

interface ProposalData {
  proposalId: number; // Assuming you have a proposalId
  title: string;
  description: string;
  amountRequested: string;
  currency: string;
  about: string;
  daoMultiSigAddr: string;
}
/**
 * @Auth Policy: Visible to all 
 * @returns 
 */
const ViewProposal: React.FC = () => {
  const { proposalId } = useParams<{ proposalId: string }>(); // Get proposalId from the URL
  const { multiSigAddr } = useParams<{ multiSigAddr: string }>(); // Get multiSigAddr from the URL
  const navigate = useNavigate();
  const [proposalData, setProposalData] = useState<ProposalData | null>(null); // State to hold proposal data

  useEffect(() => {
    const fetchProposalData = async () => {
      try {
        const response = await fetch(
          `/http://localhost:8080/ViewProposal/DaoDetails/${multiSigAddr}/proposal/${proposalId}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: ProposalData = await response.json();
        setProposalData(data);
      } catch (error) {
        console.error("Error fetching proposal data:", error);
      }
    };

    if (multiSigAddr && proposalId) {
      fetchProposalData();
    }
  }, [multiSigAddr, proposalId]);
  const handleBackClick = () => {
    if (proposalData) {
      navigate(`/DaoProfile/${multiSigAddr}`);
    }
  };

  // Render loading state if proposal data is not yet available
  if (!proposalData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <NavBar className="navbarProposal" />
      <main className="viewProposal">
        <div className="one">
          <img
            src="/images/arrow-back-black.png"
            alt="arrow-black"
            width={99}
            height={99}
            onClick={handleBackClick}
          />
          <button>Rejected</button>
        </div>

        <article>
          <h1>{proposalData.title}</h1>
          <p>{proposalData.description}</p>
        </article>

        <section>
          <button>View linked resources</button>
          <div>
            <p className="first">Amount Requested</p>
            <p className="second">
              {proposalData.amountRequested}
              <span>{proposalData.currency}</span>
            </p>
          </div>
        </section>

        <div className="about">
          <h1>About proposal</h1>
          <p>{proposalData.about}</p>
        </div>

        <div className="buttonGroup">
          <button className="one">View Votes</button>
          <button className="two">Re-propose</button>
          <button className="three">Fund Project</button>
        </div>
      </main>
      <Footer className="footerProposal" />
    </>
  );
};

export default ViewProposal;
