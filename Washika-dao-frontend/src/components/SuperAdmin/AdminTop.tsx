import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { arbitrumSepolia } from "thirdweb/chains";
import { useReadContract, useWalletBalance } from "thirdweb/react";
import { FullDaoContract } from "../../utils/handlers/Handlers";
import { client } from "../../utils/thirdwebClient";
import { DaoDetails } from "./WanachamaList";

interface AdminTopProps {
  daoDetails?: DaoDetails;
  setActiveSection: (section: string) => void;
  setDaoDetails: (d: DaoDetails) => void;
}

export default function AdminTop({ daoDetails, setActiveSection, setDaoDetails }: AdminTopProps) {
  const [memberCount, setMemberCount] = useState<number>(0);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const { multiSigAddr } = useParams<{ multiSigAddr: string }>();
  const {
    data: rawDaoData,
    isPending,
    error,
  } = useReadContract({
    contract: FullDaoContract,
    method: "getDaoByMultiSig",
    params: [multiSigAddr!],
  });

  const fetchEthToUsdRate = async (): Promise<number> => {
    try {
      const res = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
      );
      const data = await res.json();
      return data.ethereum.usd;
    } catch (error) {
      console.error("Error fetching ETH to USD rate:", error);
      return 0; // fallback
    }
  };

  const { data: balanceData, isLoading: balanceLoading } = useWalletBalance({
    address: multiSigAddr!,
    client,
    chain: arbitrumSepolia,
  });

  useEffect(() => {
    const updateDaoDetails = async () => {
      if (
        rawDaoData &&
        !isPending &&
        !error &&
        !balanceLoading &&
        balanceData
      ) {
        const ethBalance = parseFloat(balanceData.displayValue);
        const usdRate = await fetchEthToUsdRate();
        const usdBalance = ethBalance * usdRate;
        console.log("USD balance is", usdBalance);
        const parsedDao: DaoDetails = {
          daoName: rawDaoData.daoName,
          daoLocation: rawDaoData.location,
          targetAudience: rawDaoData.targetAudience,
          daoTitle: rawDaoData.daoTitle,
          daoDescription: rawDaoData.daoDescription,
          daoOverview: rawDaoData.daoOverview,
          daoImageIpfsHash: rawDaoData.daoImageUrlHash,
          daoMultiSigAddr: rawDaoData.multiSigAddr,
          multiSigPhoneNo: rawDaoData.multiSigPhoneNo.toString(),
          members: [],
          daoRegDocs: "",
          kiwango: usdBalance, // store USD instead of ETH
          accountNo: "",
          nambaZaHisa: 0,
          kiasiChaHisa: 0,
          interestOnLoans: 0,
          daoTxHash: "",
          chairpersonAddr: "",
        };
        // console.log("ParsedDaoData include", parsedDao);
        setDaoDetails(parsedDao);
        setMemberCount(1);
      }
    };

    updateDaoDetails();
  }, [rawDaoData, isPending, error, balanceLoading, balanceData, setDaoDetails]);

  useEffect(() => {
    // if (daoTxHash && authToken) {
    //   fetchDaoDetails();
    // }
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 1537); // Adjust for your breakpoints
    };

    // Initial check and event listener
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <>
      <div className="centered">
        <div className="daoImage one">
          <img src={daoDetails?.daoImageIpfsHash} alt="DaoImage" />
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
              <p className="email">
                {daoDetails?.daoMultiSigAddr
                  ? isSmallScreen
                    ? `${daoDetails?.daoMultiSigAddr.slice(
                        0,
                        14
                      )}...${daoDetails?.daoMultiSigAddr.slice(-9)}`
                    : daoDetails?.daoMultiSigAddr
                  : "N/A"}
              </p>
            )}
          </div>
        </div>
        <div className="two">
          <div className="first">
            <div className="one">
              <p className="left">USD</p>
              <p className="right">Treasury Balance</p>
            </div>
            <p className="amount">{daoDetails?.kiwango.toLocaleString()} USD</p>
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
