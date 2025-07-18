// src/pages/ViewProposal.tsx
import React, { useEffect, useState } from "react";
import { prepareContractCall, PreparedTransaction } from "thirdweb";
import {
  useReadContract,
  useSendTransaction,
  useActiveAccount,
  useActiveWalletConnectionStatus,
} from "thirdweb/react";
import { FullDaoContract } from "../utils/handlers/Handlers.js";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import NavBar from "../components/Navbar/Navbar.js";
import Footer from "../components/Footer.js";
import { LoadingPopup } from "../components/SuperAdmin/LoadingPopup.js";
import VoteCounts from "../components/Proposals/VoteCounts.js";

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

const ViewProposal: React.FC = () => {
  const { state } = useLocation();
  const preloaded = (state as PreloadedState) || null;

  const { proposalTitle: paramProposalTitle } = useParams<{
    proposalTitle: string;
  }>();
  const [proposalDetails, setProposalDetails] =
    useState<OnChainProposal | null>(
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
  const [loading, setLoading] = useState(!preloaded);
  const navigate = useNavigate();
  const [isUpVoting, setIsUpVoting] = useState(false);
  const [isDownVoting, setIsDownVoting] = useState(false);
  const isVoting = isUpVoting || isDownVoting;
  const { mutate: sendTransaction } = useSendTransaction();
  const activeAccount = useActiveAccount();
  const connectionStatus = useActiveWalletConnectionStatus();

  const { data: fetchedProposalId } = useReadContract({
    contract: FullDaoContract,
    method:
      "function getProposalIdByTitle(string _proposalTitle) view returns (bytes32)",
    params: [paramProposalTitle!],
  });

  const {
    data: fetchedProposal,
    isLoading: loadingFetched,
    error: fetchError,
  } = useReadContract({
    contract: FullDaoContract,
    method:
      "function getProposalXById(bytes32 _proposalId) view returns ((address proposalOwner, bytes32 proposalId, bytes32 daoId, string proposalUrl, string proposalTitle, string proposalStatus, uint256 proposalCreatedAt))",
    params: [fetchedProposalId as `0x${string}`],
  });

  useEffect(() => {
    if (!preloaded) {
      if (!loadingFetched && fetchedProposal) {
        setProposalDetails(fetchedProposal);
        setLoading(false);
      }
      if (fetchError) {
        console.error("Failed to fetch proposal:", fetchError);
        setLoading(false);
      }
    }
  }, [preloaded, loadingFetched, fetchedProposal, fetchError]);

  // Check if the user has already voted
  const proposalIdFinal: `0x${string}` =
    proposalDetails?.proposalId ?? "0x0000000000000000000000000000000000000000";

  const createdTs = Number(proposalDetails?.proposalCreatedAt) * 1000;
  const expiryTs = createdTs + 24 * 3600 * 1000;

  const { data: onChainOutcome, isLoading: loadingOutcome } = useReadContract({
    contract: FullDaoContract,
    method:
      "function getProposalOutcome(bytes32 _proposalId) view returns (string)",
    params: [proposalIdFinal],
  });

  const { data: onChainHasVoted, isLoading: loadingHasVoted } = useReadContract(
    {
      contract: FullDaoContract,
      method:
        "function hasVoted(address voter, bytes32 proposalId) view returns (bool)",
      params: [activeAccount?.address ?? "", proposalIdFinal] as const,
    }
  ) as { data?: boolean; isLoading: boolean };

  // local state, seeded from on-chain but then controlled locally
  const [userHasVoted, setUserHasVoted] = useState<boolean | null>(null);

  useEffect(() => {
    if (!loadingHasVoted && typeof onChainHasVoted === "boolean") {
      setUserHasVoted(onChainHasVoted);
    }
  }, [loadingHasVoted, onChainHasVoted]);

  // 4. Track live time / expiry
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const iv = setInterval(() => setNow(Date.now()), 5_000);
    return () => clearInterval(iv);
  }, []);

  const expired = now >= expiryTs;

  useEffect(() => {
    if (
      expired &&
      !loadingOutcome &&
      onChainOutcome &&
      proposalDetails?.proposalStatus !== onChainOutcome
    ) {
      setProposalDetails((p) => p! && { ...p, proposalStatus: onChainOutcome });
    }
  }, [
    expired,
    loadingOutcome,
    onChainOutcome,
    proposalDetails?.proposalStatus,
  ]);

  // loading / error states
  if (loading)
    return (
      <div className="fullheight">
        <NavBar className="" />
        <div className="daoRegistration error">
          <p>Loading...</p>
        </div>
        <Footer className={""} />
      </div>
    );
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
  if (connectionStatus === "connecting") {
    return <LoadingPopup message="Loading wallet…" />;
  }

  if (connectionStatus === "disconnected" || !activeAccount) {
    return (
      <div className="fullheight">
        <NavBar className="" />
        <div className="daoRegistration error">
          <p>Please connect your wallet to continue</p>
        </div>
        <Footer className={""} />
      </div>
    );
  }

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
      {isVoting && <LoadingPopup message="Submitting your vote…" />}
      <main className="viewProposal">
        <div className="one">
          <img
            src="/images/arrow-back-black.png"
            alt="back"
            width={48}
            height={48}
            onClick={() => navigate(-1)}
            style={{ cursor: "pointer" }}
          />
          <button className="inProgress">
            {proposalDetails.proposalStatus}
          </button>
        </div>

        <article>
          <h1>{proposalDetails.proposalTitle}</h1>
          <div className="buttons">
            <button disabled className="twoo">
              Fund Project
            </button>
            <button disabled className="twooo">
              View Statement
            </button>
          </div>
          <p>Proposal Summary will be included here, providing a brief summary about the proposal.</p>
        </article>

        <section>
          <div className="expiry">
            <p className="first">Voting expires at</p>
            <div className="second">
              <p>
                {new Date(expiryTs).toLocaleString()}
                {expired && " [voting closed]"}
              </p>
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
          <div className="votedParagraph">Checking vote status…</div>
        ) : userHasVoted ? (
          <div className="alreadyVoted">
            <div className="votedParagraph">✅ You have voted for this proposal.</div>
            {proposalDetails?.proposalId && (
              <VoteCounts proposalId={proposalDetails.proposalId} />
            )}
          </div>
        ) : expired ? (
          <div className="closed">Voting period has ended.</div>
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
