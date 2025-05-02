import NavBar from "../components/Navbar/Navbar";

import { LoadingPopup } from "../components/SuperAdmin/LoadingPopup";

import { useRef, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addNotification, removeNotification, showNotificationPopup } from "../redux/notifications/notificationSlice";
import {
  useActiveAccount,
  useActiveWalletConnectionStatus,
} from "thirdweb/react";
import Footer from "../components/Footer";
import Mikopo from "../components/SuperAdmin/Mikopo";
import Notification from "../components/SuperAdmin/Notification";
import AdminButtons from "../components/SuperAdmin/AdminButtons";
import { AdminMemberForm } from "../components/SuperAdmin/AdminMemberForm";
import AdminTop from "../components/SuperAdmin/AdminTop";
import DaoOverview from "../components/SuperAdmin/DaoOverview";
import Wanachama from "../components/SuperAdmin/Wanachama";
import { DaoDetails } from "../components/SuperAdmin/WanachamaList";

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
  const dispatch = useDispatch();
  const [activeSection, setActiveSection] = useState<string>("daoOverview");
  const [daoDetails, setDaoDetails] = useState<DaoDetails | undefined>(
    undefined
  );
  const activeAccount = useActiveAccount();
  const connectionStatus = useActiveWalletConnectionStatus();

  const prevConnectionStatus =
    useRef<typeof connectionStatus>(connectionStatus);

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

  // const fetchDaoDetails = async () => {
  //   try {
  //     const response = await fetch(
  //       `${BASE_BACKEND_ENDPOINT_URL}/Daokit/DaoDetails/GetDaoDetailsByDaoTxHash?daoTxHash=${daoTxHash}`,
  //       {
  //         headers: {
  //           Authorization: token,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  //     const data = await response.json();

  //     if (response.ok) {
  //       setDaoDetails(data.daoDetails);
  //       setMemberCount(data.daoDetails.members.length);
  //     } else {
  //       console.error("Error fetching daoDetails:", data.message);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  useEffect(() => {
    if (
      connectionStatus === "connected" &&
      prevConnectionStatus.current !== "connected"
    ) {
      const id = crypto.randomUUID()
      dispatch(
        addNotification({
          id,
          type: "info",
          message: "Wallet connected successfully",
          section: "daoOverview",
        })
      );
      dispatch(showNotificationPopup());
      setTimeout(() => {
        dispatch(removeNotification(id));
      }, 10000);
    }
    prevConnectionStatus.current = connectionStatus;
  }, [connectionStatus, dispatch]);

  if (connectionStatus === "connecting") {
    return <LoadingPopup message="Loading wallet…" />;
  }

  if (connectionStatus === "disconnected" || !activeAccount) {
    return (
      <div className="fullheight">
        <NavBar className="" />
        <p className="daoRegistration error">
          Please connect your wallet to continue
        </p>
        <Footer className={""} />
      </div>
    );
  }

  return (
    <>
      <NavBar className={"SuperAdmin"} />
      <main className="member superAdmin">
        <Notification />

        <AdminTop
          setActiveSection={setActiveSection}
          setDaoDetails={setDaoDetails}
          daoDetails={daoDetails}
        />

        <div className="DaoOperations">
          <h1>DAO operations</h1>
        </div>

        <AdminButtons
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />

        {activeSection === "daoOverview" && <DaoOverview daoDetails={daoDetails} />}

        {activeSection === "addMember" && (
          <AdminMemberForm
          />
        )}
        {activeSection === "mikopo" && <Mikopo />}
        {activeSection === "wanachama" && <Wanachama daoDetails={daoDetails} />}
      </main>
    </>
  );
};

export default SuperAdmin;
