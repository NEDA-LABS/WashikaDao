import NavBar from "../components/Navbar/Navbar.js";
import Footer from "../components/Footer.js";
import { useEffect, useState } from "react";
import { useActiveAccount, useActiveWalletConnectionStatus } from "thirdweb/react";
import { useParams, useNavigate } from "react-router-dom";
import DaoOverview from "../components/SuperAdmin/DaoOverview.js";
import Wanachama from "../components/SuperAdmin/Wanachama.js";
import AdminButtons from "../components/SuperAdmin/AdminButtons.js";
import { LoadingPopup } from "../components/SuperAdmin/LoadingPopup.js";
import { AdminMemberForm } from "../components/SuperAdmin/AdminMemberForm.js";
import { BASE_BACKEND_ENDPOINT_URL } from "../utils/backendComm.js";

// TODO: Move council role logic offchain, only addresses go on-chain
const COUNCIL_ROLES = ["Creator", "Chair", "Secretary", "Treasurer", "Nominated"];

export default function DaoSuperAdmin() {
  const { daoId } = useParams<{ daoId: string }>();
  const [activeSection, setActiveSection] = useState<string>("daoOverview");
  const [daoDetails, setDaoDetails] = useState<any>(undefined);
  const [councilMembers, setCouncilMembers] = useState<any[]>([]);
  const [isCouncil, setIsCouncil] = useState(false);
  const activeAccount = useActiveAccount();
  const connectionStatus = useActiveWalletConnectionStatus();
  const navigate = useNavigate();

  useEffect(() => {
    if (!daoId) return;
    getDaoDetails();
    getCouncilMembers();
  }, [daoId]);

  // Fetch DAO details (on-chain or backend)
  async function getDaoDetails() {
    try {
      const response = await fetch(`${BASE_BACKEND_ENDPOINT_URL}/Daokit/DaoDetails/GetDaoDetailsByDaoTxHash`, {
        headers: { Authorization: "token", "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (response.ok) setDaoDetails(data.daoDetails);
    } catch (e) { /* TODO: error handling */ }
  }

  // Fetch council members (on-chain addresses, offchain roles)
  async function getCouncilMembers() {
    // TODO: Fetch from backend for roles, on-chain for addresses
    // For now, mock council as first 5 members
    if (!daoId) return;
    try {
      const response = await fetch(`${BASE_BACKEND_ENDPOINT_URL}/Daokit/DaoDetails/GetDaoCouncilByDaoId/${daoId}`);
      const data = await response.json();
      if (response.ok && Array.isArray(data.council)) setCouncilMembers(data.council);
      // Check if current user is council
      if (activeAccount && data.council.some((m: any) => m.wallet === activeAccount.address)) setIsCouncil(true);
    } catch (e) { /* TODO: error handling */ }
  }

  // Redirect non-council
  useEffect(() => {
    if (connectionStatus === "connected" && !isCouncil) {
      navigate("/not-authorized");
    }
  }, [connectionStatus, isCouncil, navigate]);

  if (connectionStatus === "connecting") return <LoadingPopup message="Loading wallet…" />;
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

  return (
    <>
      <NavBar className={"SuperAdmin"} />
      <main className="member superAdmin">
        <section className="council-section">
          <h2 className="heading">Governing Council</h2>
          <ul className="council-list">
            {councilMembers.map((member, idx) => (
              <li key={member.wallet} className="council-member">
                <span className="role">{COUNCIL_ROLES[idx] || "Member"}</span>
                <span className="address">{member.wallet}</span>
                {/* TODO: Show offchain details (name, email) if available */}
              </li>
            ))}
          </ul>
        </section>
        <AdminButtons activeSection={activeSection} setActiveSection={setActiveSection} />
        {activeSection === "daoOverview" && <DaoOverview daoDetails={daoDetails} />}
        {activeSection === "addMember" && <AdminMemberForm />}
        {activeSection === "wanachama" && <Wanachama daoDetails={daoDetails} />}
        {/* TODO: Add more admin actions as needed */}
      </main>
      <Footer className={"SuperAdmin"} />
    </>
  );
} 