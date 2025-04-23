// src/pages/ViewProposal.tsx
import React from "react";
import { useReadContract } from "thirdweb/react";
import { FullDaoContract } from "../utils/handlers/Handlers";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/Navbar/Navbar";
import Footer from "../components/Footer";

interface OnChainProposal {
  pOwner: string;
  daoMultiSigAddr: string;
  pTitle: string;
  pSummary: string;
  pDescription: string;
  expirationTime: string; // BigNumber as a string
}

// interface VoteDetails {
//   voterAddr: string;
//   pOwner: string;
//   voteType: boolean;
// }

const ViewProposal: React.FC = () => {
  const { daoMultiSigAddr = "", proposalTitle = "" } =
    useParams<{
      daoMultiSigAddr: string;
      proposalTitle: string;
    }>();
  const navigate = useNavigate();
  // const activeAccount = useActiveAccount();

  // 1) Fetch all proposals for this DAO on‑chain
  const {
    data: rawProposals,
    isLoading: loadingProposals,
    error: proposalsError,
  } = useReadContract({
    contract: FullDaoContract,
    method: "getProposals",
    params: [daoMultiSigAddr],
  }) as {
    data?: OnChainProposal[];
    isLoading: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any;
  };

  // 2) Pick out the one matching our identifier (by title)
  const proposal = React.useMemo(() => {
    if (!rawProposals) return null;
    return rawProposals.find((p) => p.pTitle === proposalTitle);
  }, [rawProposals, proposalTitle]);

  // // 3) Fetch votes for this proposal owner
  // const {
  //   data: rawVotes,
  //   isLoading: loadingVotes,
  //   error: votesError,
  // } = useReadContract({
  //   contract: FullDaoContract,
  //   method: "getVotes",
  //   params: [proposal?.pOwner || activeAccount?.address || ""],
  // }) as {
  //   data?: VoteDetails[];
  //   isLoading: boolean;
  //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   error?: any;
  // };

  if (loadingProposals ) {
    return <div>Loading on‑chain data…</div>;
  }
  if (proposalsError ) {
    console.error(proposalsError );
    return <div>Error loading on‑chain proposal.</div>;
  }
  if (!proposal) {
    return <div>Proposal “{proposalTitle}” not found on‑chain.</div>;
  }

  // Tally up/down votes
  // const upVotes = rawVotes?.filter((v) => v.voteType).length || 0;
  // const downVotes = rawVotes?.filter((v) => !v.voteType).length || 0;

  // Expiration
  const expiryDate = new Date(
    Number(proposal.expirationTime) * 1000
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
          <h1>{proposal.pTitle}</h1>
          <div className="buttons">
            <button disabled>Fund Project</button>
            <button disabled>View Statement</button>
          </div>
          <p>{proposal.pSummary}</p>
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
          <p>{proposal.pDescription}</p>
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
