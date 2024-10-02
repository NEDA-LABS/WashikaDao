import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import ProposalGroups from "../components/ProposalGroups";
import TreasuryHistory from "../components/TreasuryHistory";
import { useNavigate, useParams } from "react-router-dom";

interface DaoDetails {
  daoName: string;
  daoLocation: string;
  targetAudience: string;
  daoTitle: string;
  daoDescription: string;
  daoOverview: string;
  daoImageIpfsHash: string;
  multiSigAddr: string;
}

const DaoProfile: React.FC = () => {
  const navigate = useNavigate();
  const { daoMultiSigAddr } = useParams<{ daoMultiSigAddr: string }>();
  const [daoDetails, setDaoDetails] = useState<DaoDetails | null>(null); //state to hold DAO details
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDaoDetails = async () => {
      try {
        const response = await fetch(
          `/DaoProfile/DaoDetails/${daoMultiSigAddr}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch Dao details");
        }
        const data = await response.json();
        setDaoDetails(data.daoDetails);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (daoMultiSigAddr) {
      fetchDaoDetails();
    }
  }, [daoMultiSigAddr]);

  const handleClick = () => {
    navigate("/CreateProposal");
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  if (!daoDetails) {
    return <div>DAO Details not available</div>;
  }
  return (
    <>
      <NavBar className={"DaoProfile"} />
      <main className="daoMain">
        <div className="daoImage">
          <img
            src={daoDetails.daoImageIpfsHash || "images/DaoImage.png"} //fallback image
            alt="DaoImage"
            width={1450}
            height={509}
          />
        </div>
        <section className="first">
          <div className="left">
            <div className="one">
              <h1>{daoDetails.daoName || "KIKUNDI CHA JUKUMU"}</h1>
              <div className="location">
                <p>{daoDetails.daoLocation || "Dar-es-Salaam, Tanzania"}</p>
                <img src="images/locationIcon.png" width="27" height="31" />
              </div>
              <p className="email">
                {daoDetails.multiSigAddr || "@JukumuDAO.ETH"}
              </p>
            </div>

            <p className="section-2">
              {daoDetails.daoDescription ||
                "Jukumu ni kikundi cha wajasiriliamali na wafanyabiashara wadogo wadogo. Tupo Mburahati, Dar-es-Salaam. Tuna mipango endelevu ya kujenga biashara zetu. Tunanunua hisa, kukopa na kuposha biashara zetu pamoja na elimu za kujijenga kiuchumi."}
            </p>

            <div className="DaoOperations">
              <h1>DAO operations</h1>
              <div className="button-group">
                <button className="button-1" onClick={handleClick}>
                  Create a Proposal
                </button>
                <button className="button-2">Vote on a proposal</button>
              </div>
            </div>

            <div className="details">
              <p className="email">{daoDetails.multiSigAddr || "@JukumuDAO.ETH" }</p>
              <p className="parag">
                This is the multi-sig account for {daoDetails.daoName || "JUKUMU" }. Create a proposal to
                get access to the JUKUMU fund.
              </p>
            </div>
          </div>

          <div className="treasury">
            <div className="first">
              <div className="one">
                <p className="left">TSH</p>
                <p className="right">Thamani ya hazina</p>
              </div>
              <p className="amount">3,000,000</p>
            </div>

            <div className="section-3">
              <div className="top">
                <img src="images/profile.png" alt="idadi" />
                <div className="taarifa">Taarifa za wanachama</div>
              </div>
              <div className="bottom">
                <h2>Idadi ya wanachama</h2>
                <p>23</p>
              </div>
              <div className="fundDao">
                <button>FUND DAO</button>
              </div>
            </div>

            <TreasuryHistory />
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
