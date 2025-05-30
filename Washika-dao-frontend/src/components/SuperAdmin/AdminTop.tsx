import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { celoAlfajoresTestnet } from "thirdweb/chains";
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
import {
  addNotification,
  removeNotification,
  showNotificationPopup,
} from "../../redux/notifications/notificationSlice";
import { OnchainDao } from "../../utils/Types";

interface AdminTopProps {
  daoDetails?: DaoDetails;
  setActiveSection: (section: string) => void;
  setDaoDetails: (d: DaoDetails) => void;
}

export default function AdminTop({
  daoDetails,
  setActiveSection,
  setDaoDetails,
}: AdminTopProps) {
  const [memberCount, setMemberCount] = useState(0);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const { multiSigAddr } = useParams<{ multiSigAddr: string }>();
  const active = useActiveAccount();
  const dispatch = useDispatch();

  // 1️⃣ Fetch all DAOs on-chain
  const { data: rawDaos, isPending: loadingDaos } = useReadContract({
    contract: FullDaoContract,
    method:
      "function getDaosInPlatformArr() view returns ((string, string, string, string, address, bytes32)[])",
  });

  // 2️⃣ Get treasury balance for the target DAO
  const { data: balanceData, isLoading: balanceLoading } = useWalletBalance({
    address: multiSigAddr || "",
    client,
    chain: celoAlfajoresTestnet,
  });

  useEffect(() => {
    if (!rawDaos || loadingDaos || balanceLoading) return;

    // 3️⃣ Map tuples → objects
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

    // 4️⃣ Find the one matching our route param
    const found = allDaos.find(
      (d) =>
        d.daoCreator.toLowerCase() === multiSigAddr!.toLowerCase() &&
        d.daoId === DaoId
    );
    if (!found) return;

    // 5️⃣ Compute USD balance
    const celoBal = parseFloat(balanceData!.displayValue);
    fetchCeloToUsdRate().then((rate) => {
      const usdBal = celoBal * rate;

      // 6️⃣ Build your front-end DTO
      const parsed: DaoDetails = {
        daoName: found.daoName,
        daoLocation: found.daoLocation,
        targetAudience: found.daoTargetAudience,
        daoTitle: found.daoName, // if you don’t have separate on-chain title/description,
        daoDescription: found.daoObjective, // you can repurpose or leave blank
        daoOverview: "",
        daoImageIpfsHash: "",
        daoMultiSigAddr: found.daoCreator,
        multiSigPhoneNo: "", // not on-chain here
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

  // ◆◆◆ FETCH ON-CHAIN MEMBERS ◆◆◆
  const { data: onchainMembers, isLoading: loadingMembers } = useReadContract({
    contract: FullDaoContract,
    method:
      "function getDaoMembers(bytes32 _daoId) view returns ((string memberEmail, address memberAddress)[])",
    params: daoID ? [daoID] : ([] as unknown as [`0x${string}`]),
  });

  useEffect(() => {
    if (loadingMembers || !onchainMembers) return;
    const members = (
      onchainMembers as Array<{
        memberEmail: string;
        memberAddress: string;
      }>
    ).map((t, i) => ({
      id: i,
      email: t.memberEmail,
      wallet: t.memberAddress,
    }));
    if (daoDetails?.members?.length === members.length) return;

    setDaoDetails({
      ...daoDetails,
      members,
    } as DaoDetails);
    setMemberCount(members.length);
  }, [onchainMembers, loadingMembers, daoDetails, setDaoDetails]);

  // handle resizing…
  useEffect(() => {
    const onResize = () => setIsSmallScreen(window.innerWidth <= 1537);
    window.addEventListener("resize", onResize);
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, []);

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
      setTimeout(() => {
        dispatch(removeNotification(id));
      }, 4000);
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
              <button>Generate MultiSigAddress</button>
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
    </>
  );
}
