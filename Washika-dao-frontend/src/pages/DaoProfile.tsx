import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/Navbar/Navbar";
import ProposalGroups from "../components/ProposalGroups";
import TreasuryHistory from "../components/TreasuryHistory";
import { useDispatch } from "react-redux";
import { addNotification, showNotificationPopup, removeNotification } from "../redux/notifications/notificationSlice";
import Notification from "../components/SuperAdmin/Notification";

interface PreloadedState {
  group: {
    daoName: string;
    daoLocation: string;
    daoObjective: string;
    daoTargetAudience: string;
    daoCreator: string;
    daoId: string;
  };
  kiwango: number;
  memberCount: number;
}

interface DaoDetails {
  daoName: string;
  daoLocation: string;
  targetAudience: string;
  daoTitle: string;
  daoDescription: string;
  daoOverview: string;
  daoImageIpfsHash: string;
  daoMultiSigAddr: string;
  kiwango: number;
  memberCount: number;
}

const DaoProfile: React.FC = () => {
  const navigate = useNavigate();
  const { daoTxHash } = useParams<{ daoTxHash: string }>();
  const { state } = useLocation();
  const preloaded = (state as PreloadedState) || null;
  const dispatch = useDispatch();

  const [daoDetails] = useState<DaoDetails | null>(
    preloaded
      ? {
          daoName:       preloaded.group.daoName,
          daoLocation:   preloaded.group.daoLocation,
          targetAudience:preloaded.group.daoTargetAudience,
          daoTitle:      preloaded.group.daoName,
          daoDescription:preloaded.group.daoObjective,
          daoOverview:   "",
          daoImageIpfsHash: "",
          daoMultiSigAddr: preloaded.group.daoCreator,
          kiwango:      preloaded.kiwango,
          memberCount:  preloaded.memberCount,
        }
      : null
  );
  const [loading] = useState(!preloaded);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  localStorage.setItem(preloaded.group.daoId, "daoId")

  useEffect(() => {
    const onResize = () => setIsSmallScreen(window.innerWidth <= 1537);
    window.addEventListener("resize", onResize);
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const fullAddress = daoDetails?.daoMultiSigAddr || "";
    const displayAddress = fullAddress
      ? isSmallScreen
        ? `${fullAddress.slice(0, 14)}…${fullAddress.slice(-9)}`
        : fullAddress
      : "N/A";
  
    const handleCopy = () => {
      if (!fullAddress) return;
  
      navigator.clipboard.writeText(fullAddress).then(() => {
        const id = crypto.randomUUID();
        dispatch(
          addNotification({
            id,
            type: "info",
            message: "Address copied to clipboard!",
          })
        );
        dispatch(showNotificationPopup());
        setTimeout(() => {
          dispatch(removeNotification(id));
        }, 10000);
      });
    };

  const handleClick = () => {
    navigate(`/CreateProposal/${daoTxHash}`);
  };

  if (loading) return <div>Loading...</div>;
  if (!daoDetails) return <div>DAO Details not available</div>;

  return (
    <>
      <NavBar className="DaoProfile" />
      <main className="daoMain">
        <Notification />
        <div className="daoImage">
          <img
            src={daoDetails.daoImageIpfsHash || "/images/default.png"}
            alt="DaoImage"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/images/default.png";
            }}
          />
        </div>

        <section className="first">
          <div className="left">
            <div className="one">
              <h1>{daoDetails.daoName}</h1>
              <div className="location">
                <p>{daoDetails.daoLocation}</p>
                <img
                  src="/images/locationIcon.png"
                  width="27"
                  height="31"
                />
              </div>
              <div className="address">
                <p className="email">{displayAddress}</p>
                {fullAddress && (
                  <button
                    onClick={handleCopy}
                    aria-label="Copy address"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      color: "#555",
                      display: "flex",
                    }}
                  >
                    <img
                      src="/images/copy.png"
                      alt="copy"
                      width={20}
                      style={{ opacity: 0.4 }}
                    />
                  </button>
                )}
              </div>
            </div>

            <p className="section-21">
              {daoDetails.daoDescription}
            </p>
            <p className="section-22">{daoDetails.daoOverview}</p>

            <div className="DaoOperations">
              <h1>DAO operations</h1>
              <div className="button-group">
                <button onClick={handleClick}>
                  Dao Overview
                </button>
                <button>Buy Shares</button>
                <button onClick={handleClick}>
                  Apply for Loan
                </button>
                <button>Make Payments</button>
              </div>
            </div>
          </div>

          <div className="treasury">
            <div className="first">
              <div className="one">
                <p className="left">USD</p>
                <p className="right">Treasury Balance</p>
              </div>
              <p className="amount">
                {daoDetails.kiwango.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                USD
              </p>
            </div>

            <div className="section-3">
              <div className="top">
                <img src="/images/profile.png" alt="idadi" />
                <div className="taarifa">Member Details</div>
              </div>
              <div className="bottom">
                <h2>Number of members</h2>
                <p>{daoDetails.memberCount}</p>
              </div>
              <div className="fundDao">
                <button>FUND DAO</button>
              </div>
            </div>

            <TreasuryHistory daoMultiSigAddr={daoDetails.daoMultiSigAddr} limit={4} />
          </div>
        </section>

        <section className="second">
          <h1 className="main">Current Proposals</h1>
          <ProposalGroups />
        </section>
      </main>
    </>
  );
};

export default DaoProfile;
