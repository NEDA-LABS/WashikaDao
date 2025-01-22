import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import { useNavigate, useParams } from "react-router-dom";

interface ProposalData {
  proposalId: number;
  proposalOwner: string;
  proposalTitle: string;
  projectSummary: string;
  proposalDescription: string;
  proposalStatus: string;
  amountRequested: number;
  profitSharePercent: number;
  daoMultiSigAddr: string;
  numUpvotes: number;
  numDownvotes: number;
}
/**
 * @Auth Policy: Visible to all
 * @returns
 */
/**
 * A React functional component that displays detailed information about a specific proposal.
 * It fetches proposal data from a backend service using the proposal ID and multi-signature address
 * obtained from the URL parameters. The component renders a loading state while fetching data
 * and displays the proposal details once the data is available.
 *
 * @component
 * @returns {JSX.Element} The rendered component displaying proposal details, including title,
 * description, amount requested, currency, and additional information. It also provides
 * navigation options to view linked resources, view votes, re-propose, and fund the project.
 *
 * @remarks
 * - Utilizes `useParams` to extract URL parameters and `useNavigate` for navigation.
 * - Handles errors during data fetching and logs them to the console.
 * - Displays a loading message until the proposal data is successfully fetched.
 */
const ViewProposal: React.FC = () => {
  const { proposalId, multiSigAddr } = useParams<{
    proposalId: string;
    multiSigAddr: string;
  }>(); // Get both proposalId and multiSigAddr from the URL
  const navigate = useNavigate();
  const [proposalData, setProposalData] = useState<ProposalData | null>(null); // State to hold proposal data

  useEffect(() => {
    const fetchProposalData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/ViewProposal/DaoDetails/${multiSigAddr}/proposal/${proposalId}`
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

  console.log("ProposalData is", proposalData);

  console.log("multiSigAddr:", multiSigAddr);
  console.log("proposalId:", proposalId);

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
          <h1>{proposalData.proposalTitle}</h1>
          <p>{proposalData.projectSummary}</p>
        </article>

        <section>
          <button>View linked resources</button>
          <div className="dooh">
            <p className="first">Amount Requested</p>
            <div className="second">
              <p>
                <span> {proposalData.amountRequested.toLocaleString()}</span>
              </p>
              <p className="left">Tsh</p>
            </div>
          </div>
        </section>

        <div className="about">
          <h1>About proposal</h1>
          <p>{proposalData.proposalDescription}</p>
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
