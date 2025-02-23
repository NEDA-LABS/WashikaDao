import React, { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../utils/backendComm";
import DaoForm from "./DaoForm";
import { IBackendDaoMember } from "../utils/Types";
import { setCurrentUser } from "../redux/users/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";

interface DaoMember {
  memberAddr: string;
}

interface Dao {
  daoName: string;
  daoLocation: string;
  targetAudience: string;
  daoTitle: string;
  daoDescription: string;
  daoOverview: string;
  daoImageIpfsHash: string;
  daoTxHash: string;
  daoMultiSigAddr: string;
  kiwango: number;
  memberCount: number;
  members: DaoMember[];
}

const GroupInfo: React.FC = () => {
  const [daos, setDaos] = useState<Dao[]>([]);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [registrationType, setRegistrationType] = useState<
    "join" | "funder" | null
  >(null);
  const [selectedGroup, setSelectedGroup] = useState<Dao | null>(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token") ?? "";
  const memberAddr = useSelector((state: RootState) => state.auth.address);
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const fetchDaos = async () => {
      try {
        const response = await fetch(`${baseUrl}/DaoGenesis/GetAllDaos`, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();

        if (Array.isArray(data.daoList)) {
          const daoWithMemberCounts = data.daoList.map((dao: Dao) => ({
            ...dao,
            memberCount: dao.members ? dao.members.length : 0,
          }));
          setDaos(daoWithMemberCounts);
        } else {
          console.error("daoList is missing or not an array");
        }
      } catch (error) {
        console.error("Failed to fetch DAOs:", error);
      }
    };

    fetchDaos();

    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 1537);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [token]);

  // When a group is clicked, check if the user is already a member.
  // If not, show the popup to choose registration type.
  const handleGroupClick = (group: Dao) => {
    if (!memberAddr) {
      alert("Connect wallet to log in");
      return;
    }
    if (group.members.some((member) => member.memberAddr === memberAddr)) {
      navigate(`/DaoProfile/${group.daoTxHash}`);
    } else {
      setSelectedGroup(group);
      setShowPopup(true);
      setRegistrationType(null); // reset selection
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setRegistrationType(null);
  };

  // currentMember holds form data. For "join" we'll collect full details,
  // for "funder" we only need a name (stored in firstName).
  const [currentMember, setCurrentMember] = useState<IBackendDaoMember>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    nationalIdNo: "",
    memberRole: "",
    memberCustomIdentifier: crypto.randomUUID(),
  });

  // If a current user exists, prefill the form with his details.
  useEffect(() => {
    if (currentUser && (currentUser.firstName || currentUser.lastName)) {
      setCurrentMember((prev) => ({
        ...prev,
        firstName: currentUser.firstName || "",
        lastName: currentUser.lastName || "",
        email: currentUser.email || "",
        phoneNumber: currentUser.phoneNumber || "",
        nationalIdNo: currentUser.nationalIdNo || "",
      }));
    }
  }, [currentUser]);

  // Consolidated onChange handler for all fields.
  const handleFieldChange =
    (field: keyof IBackendDaoMember) =>
    (
      e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
      setCurrentMember((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  // On submit, set the memberRole based on registrationType.
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedGroup) {
      alert("No DAO selected");
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let payload: any = {
      memberAddr,
      firstName: currentMember.firstName,
      lastName: currentMember.lastName,
      memberCustomIdentifier: currentMember.memberCustomIdentifier,
    };

    if (registrationType === "join") {
      payload = {
        ...payload,
        email: currentMember.email,
        phoneNumber: currentMember.phoneNumber,
        nationalIdNo: currentMember.nationalIdNo,

        memberRole: "Member", // registering as a member
      };
    } else if (registrationType === "funder") {
      payload = {
        ...payload,
        memberRole: "Funder", // registering as a funder
      };
    }

    try {
      const response = await fetch(
        `${baseUrl}/DaoKit/MemberShip/RequestToJoinDao/?daoTxHash=${selectedGroup.daoTxHash}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      await response.json();

      if (response.ok) {
        alert("Request sent successfully. You will access the Dao once your request is accepted");
        dispatch(
          setCurrentUser({
            memberAddr: payload.memberAddr,
            firstName: payload.firstName,
            lastName: payload.lastName || "",
            email: payload.email || "",
            nationalIdNo: payload.nationalIdNo || "",
            phoneNumber: payload.phoneNumber || "",
          })
        );
        // Navigate based on the registration type.
      if (registrationType === "join") {
        navigate(`/MemberProfile/${memberAddr}`);
      } else if (registrationType === "funder") {
        navigate(`/Funder/${memberAddr}`);
      }
      } else {
        console.error("Member creation transaction failed");
        alert("Member creation failed. Please check your inputs and try again");
      }
    } catch (error) {
      console.error("Submission failed:", error);
    }
  };

  return (
    <div className="groups">
      {daos.map((group, index) => (
        <div
          className="group"
          key={index}
          onClick={() => handleGroupClick(group)}
        >
          <div className="image">
            <img src={group.daoImageIpfsHash} alt={group.daoTitle} />
            <div className="taarifaTop">Taarifa</div>
          </div>
          <div className="section-1">
            <div className="left">
              <h2>{group.daoTitle}</h2>
              <div className="location">
                <p>{group.daoLocation}</p>
                <img src="/images/location.png" alt="location" />
              </div>
              <p className="email">
                {group.daoMultiSigAddr
                  ? isSmallScreen
                    ? `${group.daoMultiSigAddr.slice(
                        0,
                        14
                      )}...${group.daoMultiSigAddr.slice(-9)}`
                    : `${group.daoMultiSigAddr}`
                  : "N/A"}
              </p>
            </div>
            <div className="right">
              <h3>Treasury Balance</h3>
              <div>
                <p className="currency">TSH</p>
                <p className="amount">{group.kiwango.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <p className="section-2">{group.daoDescription}</p>
          <div className="section-3">
            <div className="top">
              <img src="/images/profile.png" alt="member details" />
              <div className="taarifa">Member Details</div>
            </div>
            <div className="bottom">
              <h2>Number of Members</h2>
              <p>{group.memberCount}</p>
            </div>
          </div>
        </div>
      ))}

      {/* Popup */}
      {showPopup && (
        <div className="popup">
          {!registrationType ? (
            <div className="option-selection">
              <h2>Register as:</h2>
              <button onClick={() => setRegistrationType("join")}>
                Request to Join DAO
              </button>
              <button onClick={() => setRegistrationType("funder")}>
                Become a Funder
              </button>
              <button onClick={closePopup}>Cancel</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {registrationType === "join" && (
                <DaoForm
                  className="form"
                  title="Join Platform"
                  description=""
                  fields={[
                    {
                      label: "First Name",
                      type: "text",
                      value: currentMember.firstName,
                      onChange: handleFieldChange("firstName"),
                    },
                    {
                      label: "Last Name",
                      type: "text",
                      value: currentMember.lastName,
                      onChange: handleFieldChange("lastName"),
                    },
                    {
                      label: "Email",
                      type: "email",
                      value: currentMember.email,
                      onChange: handleFieldChange("email"),
                    },
                    {
                      label: "Phone Number",
                      type: "tel",
                      value: currentMember.phoneNumber,
                      onChange: handleFieldChange("phoneNumber"),
                    },
                    {
                      label: "National Id",
                      type: "text",
                      value: currentMember.nationalIdNo,
                      onChange: handleFieldChange("nationalIdNo"),
                    },
                  ]}
                />
              )}
              {registrationType === "funder" && (
                <DaoForm
                  className="form"
                  title="Become Funder"
                  description="Please enter your name"
                  fields={[
                    {
                      label: "First Name",
                      type: "text",
                      value: currentMember.firstName,
                      onChange: handleFieldChange("firstName"),
                    },
                    {
                      label: "Last Name",
                      type: "text",
                      value: currentMember.lastName,
                      onChange: handleFieldChange("lastName"),
                    },
                  ]}
                />
              )}
              <div className="center">
                <button type="submit">Submit</button>
                <button type="button" onClick={closePopup}>
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default GroupInfo;
