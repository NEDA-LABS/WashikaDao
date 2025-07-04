import NavBar from "../components/Navbar/Navbar.tsx";

import { LoadingPopup } from "../components/SuperAdmin/LoadingPopup.tsx";

import {useEffect, useState} from "react";
import {
  useActiveAccount,
  useActiveWalletConnectionStatus,
} from "thirdweb/react";
import Footer from "../components/Footer.tsx";
import Mikopo from "../components/SuperAdmin/Mikopo.tsx";
import Notification from "../components/SuperAdmin/Notification.tsx";
import AdminButtons from "../components/SuperAdmin/AdminButtons.tsx";
import { AdminMemberForm } from "../components/SuperAdmin/AdminMemberForm.tsx";
import DaoOverview from "../components/SuperAdmin/DaoOverview.tsx";
import Wanachama from "../components/SuperAdmin/Wanachama.tsx";
import { DaoDetails } from "../components/SuperAdmin/WanachamaList.tsx";
import {BASE_BACKEND_ENDPOINT_URL} from "../utils/backendComm.ts";

/**
 * Renders the SuperAdmin component, which serves as the main dashboard interface
 * for super administrators. This component includes various sections such as
 * notifications, DAO operations, financial summaries, and current proposals.
 *
 * The component utilizes FontAwesome icons for visual representation of financial
 * data and includes interactive elements like buttons for navigating through
 * different DAO functionalities.
 *
 * @returns {JSX.Element} The rendered SuperAdmin component.
 */

const SuperAdmin: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("daoOverview");
  const [daoDetails, setDaoDetails] = useState<DaoDetails | undefined>(
    undefined
  );
  const activeAccount = useActiveAccount();
  const connectionStatus = useActiveWalletConnectionStatus();

  // const [authToken, setAuthToken] = useState<string>("");

  // console.log("Dao Details include", daoDetails);

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     const storedToken = localStorage.getItem("token") || "";
  //     if (storedToken) {
  //       setAuthToken(storedToken);
  //       clearInterval(intervalId);
  //     }
  //   }, 10); // check every 100ms
  //   return () => clearInterval(intervalId);
  // }, []);

    useEffect(() => {
         getDaoDetails();
    }, []);

  const getDaoDetails = async () => {
    try {
      const response = await fetch(
          // Replace it with Blockchain Query or better
        `${BASE_BACKEND_ENDPOINT_URL}/Daokit/DaoDetails/GetDaoDetailsByDaoTxHash`,
        {
          headers: {
            Authorization: "token",
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();

      if (response.ok) {
        setDaoDetails(data.daoDetails);
       // setMemberCount(data.daoDetails.members.length);
      } else {
        console.error("Error fetching daoDetails:", data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

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

  return (
    <>
      <NavBar className={"SuperAdmin"} />
      <main className="member superAdmin">
        <Notification />

        <AdminButtons
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />

        {activeSection === "daoOverview" && (
          <DaoOverview daoDetails={daoDetails} />
        )}

        {activeSection === "addMember" && <AdminMemberForm />}
        {activeSection === "mikopo" && <Mikopo />}
        {activeSection === "wanachama" && <Wanachama daoDetails={daoDetails} />}
      </main>
    </>
  );
};

export default SuperAdmin;
