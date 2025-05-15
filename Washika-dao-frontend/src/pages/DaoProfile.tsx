import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { celoAlfajoresTestnet } from "thirdweb/chains";
import {
  useActiveAccount,
  useActiveWalletConnectionStatus,
  useReadContract,
  useWalletBalance,
} from "thirdweb/react";
import Footer from "../components/Footer";
import NavBar from "../components/Navbar/Navbar";
import ProposalGroups from "../components/Proposals/ProposalGroups";
import { LoadingPopup } from "../components/SuperAdmin/LoadingPopup";
import DaoForm from "../components/DaoForm";
import Notification from "../components/SuperAdmin/Notification";
import TreasuryHistory from "../components/TreasuryHistory";
import {
  addNotification,
  removeNotification,
  showNotificationPopup,
} from "../redux/notifications/notificationSlice";
import { FullDaoContract } from "../utils/handlers/Handlers";
import { fetchCeloToUsdRate } from "../utils/priceUtils";
import { client } from "../utils/thirdwebClient";

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

interface Wanachama {
  id: number;
  email: string;
  wallet: string;
}

export interface DaoDetails {
  daoName: string;
  daoLocation: string;
  targetAudience: string;
  daoTitle: string;
  daoDescription: string;
  daoOverview?: string;
  daoImageIpfsHash?: string;
  daoMultiSigAddr: string;
  kiwango: number;
  memberCount: number;
  daoId?: string; // on-chain ID
  daoRegDocs?: string;
  multiSigPhoneNo?: string;
  accountNo?: string;
  nambaZaHisa?: number;
  kiasiChaHisa?: number;
  interestOnLoans?: number;
  daoTxHash?: string;
  chairpersonAddr?: string;
  members?: Wanachama[];
}

const DaoProfile: React.FC = () => {
  const navigate = useNavigate();
  const { multisigAddr } = useParams<{ multisigAddr: string }>();
  const { state } = useLocation();
  const preloaded = (state as PreloadedState) || null;
  const dispatch = useDispatch();
  const activeAccount = useActiveAccount();
  const [showForm, setShowForm] = useState<boolean>(false);
  const handleSendInviteClick = () => setShowForm(!showForm);;
  const [daoDetails, setDaoDetails] = useState<DaoDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const connectionStatus = useActiveWalletConnectionStatus();
  const [memberExists, setMemberExists] = useState<boolean | null>(null);
  const [, setInviteDaoId] = useState<string>("");
const handleDaoChange = (
  e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>
) => {
  setInviteDaoId(e.target.value);
};

  // on-chain: read all DAOs
  const { data: rawDaos, isPending: loadingDaos } = useReadContract({
    contract: FullDaoContract,
    method:
      "function getDaosInPlatformArr() view returns ((string,string,string,string,address,bytes32)[])",
  });

  const daos = React.useMemo(() => {
  if (!rawDaos) return [];
  return (rawDaos as Array<[string,string,string,string,string,string]>).map(
    ([daoName, , , , , daoIdBytes]) => ({
      daoName,
      daoId: daoIdBytes,
    })
  );
}, [rawDaos]);

  // on-chain: get treasury balance
  const { data: balanceData, isLoading: balanceLoading } = useWalletBalance({
    address: multisigAddr || "",
    client,
    chain: celoAlfajoresTestnet,
  });

  // on-chain: fetch members
  const { data: onchainMembers, isLoading: loadingMembers } = useReadContract({
    contract: FullDaoContract,
    method: "function getDaoMembers(bytes32) view returns ((string,address)[])",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params: daoDetails?.daoId ? [daoDetails.daoId] : ([] as any),
  });

  // handle screen size
  useEffect(() => {
    const onResize = () => setIsSmallScreen(window.innerWidth <= 1537);
    window.addEventListener("resize", onResize);
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // init dao details from state or on-chain
  useEffect(() => {
    async function initDao() {
      if (preloaded) {
        setDaoDetails({
          daoName: preloaded.group.daoName,
          daoLocation: preloaded.group.daoLocation,
          targetAudience: preloaded.group.daoTargetAudience,
          daoTitle: preloaded.group.daoName,
          daoDescription: preloaded.group.daoObjective,
          daoMultiSigAddr: preloaded.group.daoCreator,
          kiwango: preloaded.kiwango,
          memberCount: preloaded.memberCount,
          daoId: preloaded.group.daoId,
        });
        setLoading(false);
        return;
      }

      if (!rawDaos || loadingDaos) return;

      const allDaos = (
        rawDaos as Array<[string, string, string, string, string, string]>
      ).map(
        ([
          daoName,
          daoLocation,
          daoObjective,
          daoTargetAudience,
          daoCreator,
          daoIdBytes,
        ]) => ({
          daoName,
          daoLocation,
          daoObjective,
          daoTargetAudience,
          daoCreator,
          daoId: daoIdBytes,
        })
      );

      const found = allDaos.find(
        (d) => d.daoCreator.toLowerCase() === multisigAddr!.toLowerCase()
      );
      if (!found) {
        setLoading(false);
        return;
      }

      if (balanceLoading) return;
      const celoBal = balanceData ? parseFloat(balanceData.displayValue) : 0;
      const rate = await fetchCeloToUsdRate();
      const usdBal = celoBal * rate;

      setDaoDetails({
        daoName: found.daoName,
        daoLocation: found.daoLocation,
        targetAudience: found.daoTargetAudience,
        daoTitle: found.daoName,
        daoDescription: found.daoObjective,
        daoOverview: "",
        daoImageIpfsHash: "",
        daoMultiSigAddr: found.daoCreator,
        kiwango: usdBal,
        memberCount: 0,
        daoId: found.daoId,
      });
      setLoading(false);
    }

    initDao();
  }, [
    preloaded,
    rawDaos,
    loadingDaos,
    balanceData,
    balanceLoading,
    multisigAddr,
  ]);

  const { data: rawMemberCheck, isLoading: memberLoading } = useReadContract({
    contract: FullDaoContract,
    method:
      "function isYMemberOfDaoX(bytes32 _daoId, address _userAddress) view returns (bool)",
    // only call once we know which DAO and who the user is
    params:
      daoDetails && activeAccount?.address
        ? [daoDetails.daoId, activeAccount.address]
        : // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ([] as any),
  });

  // whenever the raw on-chain bool comes back, stash it in state
  useEffect(() => {
    if (typeof rawMemberCheck === "boolean") {
      setMemberExists(rawMemberCheck);
    }
  }, [rawMemberCheck]);

  // update member count when on-chain members load
  useEffect(() => {
    if (!daoDetails || loadingMembers || !onchainMembers) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const count = (onchainMembers as Array<any>).length;
    if (count !== daoDetails.memberCount) {
      setDaoDetails({ ...daoDetails, memberCount: count });
    }
  }, [onchainMembers, loadingMembers, daoDetails]);

  // Copy address notification
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
      setTimeout(() => dispatch(removeNotification(id)), 4000);
    });
  };

  const handleClick = () => navigate("/CreateProposal");

  if (
    loading ||
    loadingDaos ||
    balanceLoading ||
    loadingMembers ||
    memberLoading ||
    connectionStatus === "connecting"
  ) {
    return <LoadingPopup message="Loading…" />;
  }

  if (!daoDetails) return <div>DAO Details not available</div>;

  if (!activeAccount?.address) {
    return (
      <div className="fullheight">
        <NavBar className={""} />
        <div className="daoRegistration error">
          <p>Please connect your wallet to continue</p>
        </div>
        <Footer className={""} />
      </div>
    );
  }

  if (memberExists === false) {
    return (
      <div className="fullheight">
        <NavBar className={""} />
        <div className="daoRegistration error">
          <p>You are not a member of this DAO.</p>
          <div className="button-groupp">
            <button onClick={handleSendInviteClick}>Send Invite</button>
            <button onClick={() => navigate("/MarketPlace")}>
              Marketplace
            </button>
          </div>
        </div>
        <Footer className={""} />

        {showForm && (
          <div className=" popupp">
            <form>
              <DaoForm
                className="form"
                title="Apply to be a Member"
                description=""
                fields={[
                  {
                    label: "email",
                    type: "email",
                  },
                  {
                    label: "Select Dao",
                    type: "select",
                    options: [
                      {
                        label: "Select Dao",
                        value: "",
                        disabled: true,
                        selected: true,
                      },
                      ...daos.map((dao) => ({
                        label: dao.daoName,
                        value: dao.daoName,
                      })),
                    ],
                    onChange: handleDaoChange,
                  },
                ]}
              />
              <div className="center">
                <button className="createAccount" type="submit">
                  Submit
                </button>
                <button
                  className="closebtn"
                  type="button"
                  onClick={handleSendInviteClick}
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    );
  }

  localStorage.setItem("daoId", daoDetails.daoId!);

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
                <img src="/images/locationIcon.png" width="27" height="31" />
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

            <p className="section-21">{daoDetails.daoDescription}</p>
            <p className="section-22">{daoDetails.daoOverview}</p>

            <div className="DaoOperations">
              <h1>DAO operations</h1>
              <div className="button-group">
                <button>Dao Overview</button>
                <button>Buy Shares</button>
                <button onClick={handleClick}>Apply for Loan</button>
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

            <TreasuryHistory
              daoDetails={daoDetails}
              daoMultiSigAddr={daoDetails.daoMultiSigAddr}
              limit={4}
            />
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
