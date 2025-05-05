// src/pages/ViewProposal.tsx
import React, { useEffect, useState } from "react";
import { prepareContractCall, PreparedTransaction } from "thirdweb";
import {
  useReadContract,
  useSendTransaction,
  useActiveAccount,
} from "thirdweb/react";
import { FullDaoContract } from "../utils/handlers/Handlers";
import { Link, useLocation, useNavigate } from "react-router-dom";
import NavBar from "../components/Navbar/Navbar";
import Footer from "../components/Footer";

interface PreloadedState {
  proposal: {
    proposalOwner: string;
    proposalId: `0x${string}`;
    daoId: string;
    proposalUrl: string;
    proposalTitle: string;
    proposalStatus: string;
    proposalCreatedAt: bigint;
  };
}
interface OnChainProposal {
  proposalOwner: string;
  proposalId: `0x${string}`;
  daoId: string;
  proposalUrl: string;
  proposalTitle: string;
  proposalStatus: string;
  proposalCreatedAt: bigint;
}

// interface VoteDetails {
//   voterAddr: string;
//   pOwner: string;
//   voteType: boolean;
// }

const ViewProposal: React.FC = () => {
  const { state } = useLocation();
  const preloaded = (state as PreloadedState) || null;
  const [proposalDetails] = useState<OnChainProposal | null>(
    preloaded
      ? {
          proposalOwner: preloaded.proposal.proposalOwner,
          proposalId: preloaded.proposal.proposalId,
          daoId: preloaded.proposal.daoId,
          proposalUrl: preloaded.proposal.proposalUrl,
          proposalTitle: preloaded.proposal.proposalTitle,
          proposalStatus: preloaded.proposal.proposalStatus,
          proposalCreatedAt: preloaded.proposal.proposalCreatedAt,
        }
      : null
  );
  const [loading] = useState(!preloaded);
  const navigate = useNavigate();
  const [isUpVoting, setIsUpVoting] = useState(false);
  const [isDownVoting, setIsDownVoting] = useState(false);
  const { mutate: sendTransaction } = useSendTransaction();
  const activeAccount = useActiveAccount();

  // Check if the user has already voted
  const proposalId = proposalDetails!.proposalId;
  const { data: onChainHasVoted, isLoading: loadingHasVoted } = useReadContract(
    {
      contract: FullDaoContract,
      method:
        "function hasVoted(address voter, bytes32 proposalId) view returns (bool)",
      params: [activeAccount?.address ?? "", proposalId] as const,
    }
  ) as { data?: boolean; isLoading: boolean };

  // local state, seeded from on-chain but then controlled locally
  const [userHasVoted, setUserHasVoted] = useState<boolean | null>(null);

  useEffect(() => {
    if (!loadingHasVoted && typeof onChainHasVoted === "boolean") {
      setUserHasVoted(onChainHasVoted);
    }
  }, [loadingHasVoted, onChainHasVoted]);

  // loading / error states
  if (loading) return <div>Loading...</div>;
  if (!proposalDetails)
    return (
      <div className="fullheight">
        <NavBar className="" />
        <div className="daoRegistration error">
          <p>Proposal Details not available</p>
        </div>
        <Footer className={""} />
      </div>
    );
  if (!activeAccount?.address)
    return (
      <div className="fullheight">
        <NavBar className="" />
        <div className="daoRegistration error">
          <p>Please connect your wallet to continue</p>
        </div>
        <Footer className={""} />
      </div>
    );

  // compute expiration
  const expiryDate = new Date(
    Number(proposalDetails.proposalCreatedAt) * 1000
  ).toLocaleString();

  const handleUpVote = () => {
    console.log("Submitting upVote for", proposalDetails.proposalId);
    setIsUpVoting(true);
    setUserHasVoted(true); // optimistically hide buttons
    const tx = prepareContractCall({
      contract: FullDaoContract,
      method: "function upVote(bytes32 _proposalId, bytes32 _daoId)",
      params: [
        proposalDetails.proposalId as `0x${string}`,
        proposalDetails.daoId as `0x${string}`,
      ],
    }) as PreparedTransaction;
    console.log("Prepared upVote tx:", tx);
    sendTransaction(tx, {
      onSuccess: (receipt) => {
        console.log("upVote successful:", receipt);
        setIsUpVoting(false);
      },
      onError: (err) => {
        console.error("upVote failed:", err);
        setIsUpVoting(false);
        setUserHasVoted(false);
      },
    });
  };

  const handleDownVote = () => {
    console.log("Submitting downVote for", proposalDetails.proposalId);
    setIsDownVoting(true);
    setUserHasVoted(true);
    const tx = prepareContractCall({
      contract: FullDaoContract,
      method: "function downVote(bytes32 _proposalId, bytes32 _daoId)",
      params: [
        proposalDetails.proposalId as `0x${string}`,
        proposalDetails.daoId as `0x${string}`,
      ],
    }) as PreparedTransaction;
    console.log("Prepared downVote tx:", tx);
    sendTransaction(tx, {
      onSuccess: (receipt) => {
        console.log("downVote successful:", receipt);
        setIsDownVoting(false);
      },
      onError: (err) => {
        console.error("downVote failed:", err);
        setIsDownVoting(false);
        setUserHasVoted(false);
      },
    });
  };
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
          <button className="inProgress">{proposalDetails.proposalStatus}</button>
        </div>

        <article>
          <h1>{proposalDetails.proposalTitle}</h1>
          <div className="buttons">
            <button disabled>Fund Project</button>
            <button disabled>View Statement</button>
          </div>
          {/* <p>Summary from backend here</p> */}
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
          <Link to={proposalDetails.proposalUrl} className="link">
            View linked resources
          </Link>
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

        {loadingHasVoted || userHasVoted === null ? (
          <div>Checking vote status…</div>
        ) : userHasVoted ? (
          <div className="alreadyVoted">
            ✅ You have voted for this proposal.
          </div>
        ) : (
          <div className="buttons buttonss">
            <button
              className="onee"
              onClick={handleUpVote}
              disabled={isUpVoting || isDownVoting}
            >
              {isUpVoting ? "Voting…" : <>👍 Vote Yes</>}
            </button>
            <button
              className="twoe"
              onClick={handleDownVote}
              disabled={isUpVoting || isDownVoting}
            >
              {isDownVoting ? "Voting…" : "👎 Deny"}
            </button>
          </div>
        )}
      </main>
      <Footer className="footerProposal" />
    </>
  );
};

export default ViewProposal;
