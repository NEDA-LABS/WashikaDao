import React, { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_BACKEND_ENDPOINT_URL } from "../utils/backendComm";
import DaoForm from "./DaoForm";
import { IBackendDaoMember } from "../utils/Types";
import { setCurrentUser } from "../redux/users/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useActiveAccount } from "thirdweb/react";
import { useReadContract } from "thirdweb/react";
import { FullDaoContract } from "../utils/handlers/Handlers";
import GroupCard from "./GroupCard";

interface Dao {
  // daoName: string;
  // daoLocation: string;
  // targetAudience: string;
  // daoTitle: string;
  // daoDescription: string;
  // daoOverview: string;
  // daoImageIpfsHash: string;
  // daoTxHash: string;
  // daoMultiSigAddr: string;
  // kiwango: number;
  // memberCount: number;
  // members: DaoMember[];
  daoName: string;
  daoLocation: string;
  daoObjective: string;
  daoTargetAudience: string;
  daoCreator: string;
  daoId: `0x${string}`;
}

export default function GroupInfo() {
  const [daos, setDaos] = useState<Dao[]>([]);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [registrationType, setRegistrationType] = useState<
    "join" | "funder" | null
  >(null);
  const [selectedGroup] = useState<Dao | null>(null);
  const navigate = useNavigate();
  const activeAccount = useActiveAccount();
  const memberAddr = activeAccount?.address;
  const dispatch = useDispatch();

  const currentUser = useSelector((state: RootState) => state.user);

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

  const { data: rawDaos, isPending: loadingDaos } = useReadContract({
    contract: FullDaoContract,
    method:
      "function getDaosInPlatformArr() view returns ((string, string, string, string, address, bytes32)[])",
  });

  useEffect(() => {
    if (!rawDaos) return;
    const parsed = (
      rawDaos as Array<[string, string, string, string, string, `0x${string}`]>
    ).map(
      ([
        daoName,
        daoLocation,
        daoObjective,
        daoTargetAudience,
        daoCreator,
        daoId,
      ]) => ({
        daoName,
        daoLocation,
        daoObjective,
        daoTargetAudience,
        daoCreator,
        daoId,
      })
    );

    setDaos(parsed);

    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 1537);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [rawDaos]);

  if (loadingDaos) {
    return <div>Loading DAOs…</div>;
  }

  // When a group is clicked, check if the user is already a member.
  // If not, show the popup to choose registration type.

  const closePopup = () => {
    setShowPopup(false);
    setRegistrationType(null);
  };

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
        `${BASE_BACKEND_ENDPOINT_URL}/DaoKit/MemberShip/RequestToJoinDao/?daoTxHash=${selectedGroup.daoId}`,
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
        alert("Request sent successfully.");
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
      {daos.map(
        (
          group // Iterate over the group data array
        ) => (
          <GroupCard
          key={group.daoId}
          group={group}
          isSmallScreen={isSmallScreen}
        />
        )
      )}

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
}
