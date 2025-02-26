import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import NavBar from "../components/Navbar/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import { baseUrl } from "../utils/backendUtils/backendComm";

interface ProposalData {
  proposalCustomIdentifier: string;
  proposalOwner: string;
  proposalTitle: string;
  proposalSummary: string;
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
  const { proposalCustomIdentifier, daoMultiSigAddr } = useParams<{
    proposalCustomIdentifier: string;
    daoMultiSigAddr: string;
  }>(); // Get both proposalCustomIdentifier and daoMultiSigAddr from the URL
  console.log(daoMultiSigAddr, proposalCustomIdentifier);
  const navigate = useNavigate();
  const [proposalData, setProposalData] = useState<ProposalData | null>(null); // State to hold proposal data
  const token = localStorage.getItem("token") ?? "";
  const memberAddr = localStorage.getItem("address");
  const selectedDaoTxHash = localStorage.getItem("selectedDaoTxHash");

  useEffect(() => {
    const fetchProposalData = async () => {
      try {
        const response = await fetch(
          `${baseUrl}/DaoKit/Proposals/GetProposalDetails/?daoMultiSigAddr=${daoMultiSigAddr}&proposalCustomIdentifier=${proposalCustomIdentifier}`,
          {
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: ProposalData = await response.json();
        console.log("Fetched Proposal Data:", data);
        setProposalData(data);
      } catch (error) {
        console.error("Error fetching proposal data:", error);
      }
    };

    if (daoMultiSigAddr && proposalCustomIdentifier) {
      fetchProposalData();
    }
  }, [daoMultiSigAddr, proposalCustomIdentifier, token]);

  const handleVote = async (
    voteType: "UpVoteProposal" | "DownVoteProposal"
  ) => {
    if (!daoMultiSigAddr || !proposalCustomIdentifier) return;

    // Determine the vote value: true for upvote, false for downvote.
    const voteValue = voteType === "UpVoteProposal";

    try {
      const response = await fetch(`${baseUrl}/DaoKit/Proposals/voteProposal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token, // Include the token in the Authorization header
        },
        body: JSON.stringify({
          proposalCustomIdentifier,
          daoMultiSigAddr,
          voterAddr: memberAddr,
          voteValue,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to cast vote");
      }

      // Refresh proposal data after voting
      const updatedData = await response.json();
      alert(voteValue ? "Voted Yes" : "Voted No");
      console.log("Updated Proposal Data:", updatedData);
      if (updatedData.amountRequested !== undefined) {
        setProposalData(updatedData);
      } else {
        console.warn("Unexpected API response:", updatedData);
      }
    } catch (error) {
      console.error("Error voting:", error);
      alert("Already voted");
    }
  };

  const handleBackClick = () => {
    if (proposalData) {
      navigate(`/DaoProfile/${selectedDaoTxHash}`);
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
          <button
            className={
              proposalData.proposalStatus === "open" ? "inProgress" : "rejected"
            }
          >
            Pending
          </button>
        </div>

        <article>
          <h1>{proposalData.proposalTitle}</h1>
          <div className="buttons">
            <button className="twoo">Fund Project</button>
            <button className="twooo">View Statement</button>
          </div>
          <p>{proposalData.proposalSummary}</p>
        </article>

        <section>
          <button>View linked resources</button>
          {proposalData?.amountRequested !== undefined ? (
            <div className="dooh">
              <p className="first">Amount Requested</p>
              <div className="second">
                <p>
                  <span> {proposalData.amountRequested.toLocaleString()}</span>
                </p>
                <p className="left">Tsh</p>
              </div>
            </div>
          ) : (
            <p>Loading amount requested...</p>
          )}
        </section>

        <div className="about">
          <h1>About proposal</h1>
          <p>{proposalData.proposalDescription}</p>
        </div>

        <div className="buttons buttonss">
          <button className="onee" onClick={() => handleVote("UpVoteProposal")}>
            <img src="/images/Star.png" alt="star" />
            Vote Yes
          </button>
          <button
            className="twoe"
            onClick={() => handleVote("DownVoteProposal")}
          >
            Deny
          </button>
        </div>
      </main>
      <Footer className="footerProposal" />
    </>
  );
};

export default ViewProposal;
