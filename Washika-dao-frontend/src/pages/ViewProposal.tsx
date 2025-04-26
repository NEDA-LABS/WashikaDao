// src/pages/ViewProposal.tsx
import React from "react";
import { useReadContract } from "thirdweb/react";
import { FullDaoContract } from "../utils/handlers/Handlers";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/Navbar/Navbar";
import Footer from "../components/Footer";

interface OnChainProposal {
  proposalOwner: string;
  proposalId: string;
  daoId: string;
  proposalUrl: string;
  proposalTitle: string;
  proposalStatus: string;
  proposalCreatedAt: string;
}

// interface VoteDetails {
//   voterAddr: string;
//   pOwner: string;
//   voteType: boolean;
// }

const ViewProposal: React.FC = () => {
  const { proposalTitle = "" } = useParams<{
    proposalTitle: string;
  }>();
  const navigate = useNavigate();
  const ZERO_ID = "0x0000000000000000000000000000000000000000000000000000000000000000" as const;
  // const activeAccount = useActiveAccount();

  //
  // 1️⃣ Fetch the proposalId by its title
  //
  const {
    data: rawProposalId,
    isLoading: loadingId,
    error: idError,
  } = useReadContract({
    contract: FullDaoContract,
    method:
      "function getProposalIdByTitle(string _proposalTitle) view returns (bytes32)",
    params: [proposalTitle] as const,
  }) as {
    data?: string;
    isLoading: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any;
  };

  //
  // 2️⃣ Once we have the ID, fetch the proposal itself
  //
  const idParam = (rawProposalId as `0x${string}`) ?? ZERO_ID;
  const {
    data: rawProposal,
    isLoading: loadingProposal,
    error: proposalError,
  } = useReadContract({
    contract: FullDaoContract,
    method:
      "function getProposalXById(bytes32 _proposalId) view returns ((address proposalOwner, bytes32 proposalId, bytes32 daoId, string proposalUrl, string proposalTitle, string proposalStatus, uint256 proposalCreatedAt))",
      params: [idParam] as const,
  }) as {
    data?: OnChainProposal;
    isLoading: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any;
  };

  // loading / error states
  if (loadingId || loadingProposal) {
    return <div>Loading on‐chain data…</div>;
  }
  if (idError || proposalError) {
    console.error(idError ?? proposalError);
    return <div>Error loading on‐chain proposal.</div>;
  }
  if (!rawProposal) {
    return <div>Proposal “{proposalTitle}” not found on‐chain.</div>;
  }

  // compute expiration
  const expiryDate = new Date(
    Number(rawProposal.proposalCreatedAt) * 1000
  ).toLocaleString();

  return (
    <>
      <NavBar className="navbarProposal" />
      <main className="viewProposal">
        <div className="one">
          <img
            src="/images/arrow-back-black.png"
            alt="back"
            width={32}
            height={32}
            onClick={() => navigate(-1)}
            style={{ cursor: "pointer" }}
          />
          <button className="inProgress">On‑Chain</button>
        </div>

        <article>
          <h1>{rawProposal.proposalTitle}</h1>
          <div className="buttons">
            <button disabled>Fund Project</button>
            <button disabled>View Statement</button>
          </div>
          <p>Summary from backend here</p>
        </article>

        <section>
          <div className="dooh">
            <p className="first">Expires at</p>
            <div className="second">
              <p>{expiryDate}</p>
            </div>
          </div>
        </section>

        <section>
          <button>View linked resources</button>
          <div className="dooh">
            <p className="first">Amount Requested</p>
            <div className="second">
              <p>
                <span> 600</span>
              </p>
              <p className="left">Usd</p>
            </div>
          </div>
        </section>

        <div className="about">
          <h1>About proposal</h1>
          <p>Proposal Description</p>
        </div>

        <div className="buttons buttonss">
          <button
            className="onee"
            onClick={() => {
              /* cast an upvote on‑chain… */
            }}
          >
            <img src="/images/Star.png" alt="star" />
            Vote Yes
          </button>
          <button
            className="twoe"
            onClick={() => {
              /* cast a downvote on‑chain… */
            }}
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
