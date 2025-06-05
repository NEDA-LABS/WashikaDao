import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  useReadContract,
  useWalletBalance,
  useActiveAccount,
} from "thirdweb/react";
import { FullDaoContract } from "../../utils/handlers/Handlers";
import { client } from "../../utils/thirdwebClient";
import { DaoDetails } from "./WanachamaList";
import { fetchCeloToUsdRate } from "../../utils/priceUtils";
import { useDispatch } from "react-redux";
// import Safe, {
//   PredictedSafeProps,
//   SafeAccountConfig,
// } from "@safe-global/protocol-kit";
// import EthersAdapter from '@safe-global/safe-ethers-lib';
import {
  addNotification,
  removeNotification,
  showNotificationPopup,
} from "../../redux/notifications/notificationSlice";
import { OnchainDao } from "../../utils/Types";
import { celoAlfajoresTestnet } from "thirdweb/chains";
// import { ethers } from "ethers";

interface AdminTopProps {
  daoDetails?: DaoDetails;
  setActiveSection: (section: string) => void;
  setDaoDetails: (d: DaoDetails) => void;
}

// const SAFE_RPC = "https://alfajores-forno.celo-testnet.org";
// const SAFE_THRESHOLD = 2;

export default function AdminTop({
  daoDetails,
  setActiveSection,
  setDaoDetails,
}: AdminTopProps) {
  const [memberCount, setMemberCount] = useState(0);
  const [showMemberPopup, setShowMemberPopup] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  // const [isDeploying, setIsDeploying] = useState(false);

  const { multiSigAddr } = useParams<{ multiSigAddr: string }>();
  const active = useActiveAccount();
  const dispatch = useDispatch();

  // const provider = new ethers.providers.Web3Provider(window.ethereum);
  // const signer = provider.getSigner();

  const { data: rawDaos, isPending: loadingDaos } = useReadContract({
    contract: FullDaoContract,
    method:
      "function getDaosInPlatformArr() view returns ((string, string, string, string, address, bytes32)[])",
  });

  const { data: balanceData, isLoading: balanceLoading } = useWalletBalance({
    address: multiSigAddr || "",
    client,
    chain: celoAlfajoresTestnet,
  });

  useEffect(() => {
    if (!rawDaos || loadingDaos || balanceLoading) return;

    const allDaos = (
      rawDaos as Array<[string, string, string, string, string, string]>
    ).map(
      ([
        daoName,
        daoLocation,
        daoObjective,
        daoTargetAudience,
        daoCreator,
        daoId,
      ]) =>
        ({
          daoName,
          daoLocation,
          daoObjective,
          daoTargetAudience,
          daoCreator: daoCreator as `0x${string}`,
          daoId,
        } as OnchainDao)
    );

    const DaoId = localStorage.getItem("selectedDaoId");
    const found = allDaos.find(
      (d) =>
        d.daoCreator.toLowerCase() === multiSigAddr?.toLowerCase() &&
        d.daoId === DaoId
    );
    if (!found) return;

    const celoBal = parseFloat(balanceData?.displayValue || "0");
    fetchCeloToUsdRate().then((rate) => {
      const usdBal = celoBal * rate;

      const parsed: DaoDetails = {
        daoName: found.daoName,
        daoLocation: found.daoLocation,
        targetAudience: found.daoTargetAudience,
        daoTitle: found.daoName,
        daoDescription: found.daoObjective,
        daoOverview: "",
        daoImageIpfsHash: "",
        daoMultiSigAddr: found.daoCreator,
        multiSigPhoneNo: "",
        members: [],
        daoRegDocs: "",
        kiwango: usdBal,
        accountNo: "",
        nambaZaHisa: 0,
        kiasiChaHisa: 0,
        interestOnLoans: 0,
        daoTxHash: "",
        chairpersonAddr: found.daoCreator,
        daoId: found.daoId,
      };

      setDaoDetails(parsed);
    });
  }, [
    rawDaos,
    loadingDaos,
    balanceData,
    balanceLoading,
    multiSigAddr,
    active,
    setDaoDetails,
  ]);

  const daoID = daoDetails?.daoId;

  const { data: onchainMembers, isLoading: loadingMembers } = useReadContract({
    contract: FullDaoContract,
    method:
      "function getDaoMembers(bytes32 _daoId) view returns ((string memberEmail, address memberAddress)[])",
    params: daoID ? [daoID] : ([] as unknown as [`0x${string}`]),
  });

  useEffect(() => {
    if (loadingMembers || !onchainMembers) return;

    const members = (
      onchainMembers as Array<{ memberEmail: string; memberAddress: string }>
    ).map((t, i) => ({
      id: i,
      email: t.memberEmail,
      wallet: t.memberAddress,
    }));

    if (daoDetails?.members?.length === members.length) return;

    setDaoDetails({
      ...daoDetails!,
      members,
    });
    setMemberCount(members.length);
  }, [onchainMembers, loadingMembers, daoDetails, setDaoDetails]);

  useEffect(() => {
    const onResize = () => setIsSmallScreen(window.innerWidth <= 1537);
    window.addEventListener("resize", onResize);
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // const deploySafe = useCallback(async () => {
  //   if (isDeploying) return;
  //   setIsDeploying(true);

  //   if (selectedMembers.length < SAFE_THRESHOLD) {
  //     alert(`Please select at least ${SAFE_THRESHOLD} members.`);
  //     setIsDeploying(false);
  //     return;
  //   }

  //   try {
  //     const ethAdapter = new EthersAdapter({
  //       ethers,
  //       signerOrProvider: signer,
  //     });
  //     const safeAccountConfig: SafeAccountConfig = {
  //       owners: selectedMembers,
  //       threshold: SAFE_THRESHOLD,
  //     };

  //     if (!signer) {
  //       alert("Connect your wallet first");
  //       return;
  //     }

  //     const protocolKit = await Safe.init({
  //       ethAdapter,
  //       predictedSafe: { safeAccountConfig } as PredictedSafeProps,
  //     });

  //     const predictedAddress = await protocolKit.getAddress();
  //     const deploymentTx = await protocolKit.createSafeDeploymentTransaction();

  //     if (!signer) {
  //       alert("Connect your wallet first");
  //       return;
  //     }

  //     const txResponse = await signer.sendTransaction({
  //       to: deploymentTx.to,
  //       value: deploymentTx.value,
  //       data: deploymentTx.data,
  //     });

  //     const receipt = await txResponse.wait();
  //     console.log(receipt);

  //     const id = crypto.randomUUID();
  //     dispatch(
  //       addNotification({
  //         id,
  //         type: "success",
  //         message: `Safe deployed at ${predictedAddress}`,
  //       })
  //     );
  //     dispatch(showNotificationPopup());
  //     setTimeout(() => dispatch(removeNotification(id)), 5000);

  //     setDaoDetails({
  //       ...daoDetails!,
  //       daoMultiSigAddr: predictedAddress,
  //     });

  //     setShowMemberPopup(false);
  //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   } catch (e: any) {
  //     console.error("❌ Safe deploy failed", e);
  //     alert(`Deployment failed: ${e.message}`);
  //   } finally {
  //     setIsDeploying(false);
  //   }
  // }, [
  //   isDeploying,
  //   selectedMembers,
  //   signer,
  //   dispatch,
  //   daoDetails,
  //   setDaoDetails,
  // ]);

  const fullAddress = daoDetails?.chairpersonAddr || "";
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

  if (!daoDetails) return null;
  const daoId = daoDetails.daoId;
  localStorage.setItem("daoId", daoId);

  if (loadingDaos) return <div>Loading DAO…</div>;

  return (
    <>
      <div className="centered">
        <div className="daoImage one">
          <img
            src={daoDetails?.daoImageIpfsHash || "/images/default.png"}
            alt="DaoImage"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/images/default.png";
            }}
          />
        </div>
      </div>
      <div className="top">
        <div className="one onesy">
          <h1>{daoDetails?.daoName}</h1>
          <div className="location">
            <p>{daoDetails?.daoLocation}</p>
            <img src="/images/locationIcon.png" width="27" height="31" />
          </div>
          <div>
            {daoDetails?.daoMultiSigAddr === daoDetails?.chairpersonAddr ? (
              <button onClick={() => setShowMemberPopup(true)}>
                Generate MultiSigAddress
              </button>
            ) : (
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
            )}
          </div>
        </div>
        <div className="two">
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
          <div className="section">
            <img src="/images/profile.png" alt="idadi" />
            <h2>
              Number of
              <br /> members
            </h2>
            <p>{memberCount}</p>
          </div>

          <button
            className="taarifa"
            onClick={() => setActiveSection("wanachama")}
          >
            Member Details
          </button>
        </div>
      </div>
      {showMemberPopup && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Select Members for MultiSig</h2>
            <div className="overflow">
              {daoDetails?.members?.length ? (
                <ul className="member-list">
                  {daoDetails.members.map((member) => (
                    <li key={member.id}>
                      <label>
                        <input
                          type="checkbox"
                          value={member.wallet}
                          checked={selectedMembers.includes(member.wallet)}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (e.target.checked) {
                              setSelectedMembers((prev) => [...prev, value]);
                            } else {
                              setSelectedMembers((prev) =>
                                prev.filter((addr) => addr !== value)
                              );
                            }
                          }}
                        />
                        <span>{member.email}</span>
                        <small>{member.wallet}</small>
                      </label>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No members found.</p>
              )}
            </div>

            <div className="modal-actions">
              {/* <button disabled={isDeploying} onClick={deploySafe}>
                {isDeploying ? "Deploying…" : "Generate MultiSig"}
              </button> */}
              <button>
                Generate MultiSig
              </button>
              <button
                className="cancel"
                onClick={() => setShowMemberPopup(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
