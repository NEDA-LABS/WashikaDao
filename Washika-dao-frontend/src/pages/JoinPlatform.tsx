import React, { ChangeEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Footer from "../components/Footer";
import NavBar from "../components/Navbar/Navbar";
import DaoForm from "../components/DaoForm";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../redux/users/userSlice";
import { BASE_BACKEND_ENDPOINT_URL, ROUTE_PROTECTOR_KEY } from "../utils/backendComm";
import { IBackendDaoMember } from "../utils/Types";
import { useActiveAccount } from "thirdweb/react";

/**
 *@Auth policy: checks if isLoggedIn if not requires you to else proceed
 * @returns
 */

/**
 * Component for joining a platform and managing DAO memberships.
 *
 * This component allows users to create an account, select a role, and join a DAO.
 * It manages user input for personal details and role selection, fetches available DAOs,
 * and handles form submission to register the user with the selected DAO.
 *
 * @component
 * @returns {React.FC} A React functional component.
 *
 * @remarks
 * - Utilizes React hooks for state management and side effects.
 * - Fetches DAO details from a specified endpoint and updates the state accordingly.
 * - Handles form submission by sending user data to the server and navigating based on the role.
 *
 * @example
 * <JoinPlatform />
 *
 * @dependencies
 * - `useNavigate` from `react-router-dom` for navigation.
 * - `useDispatch` from `react-redux` for dispatching actions.
 * - `useLocation` from `react-router-dom` for accessing location state.
 *
 * @see DaoForm
 * @see NavBar
 * @see Footer
 */

const JoinPlatform: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [completedSteps, setCompletedSteps] = useState<number>(0);
  const activeAccount = useActiveAccount();
      const memberAddr = activeAccount?.address;
  const { daoTxHash } = useParams<{ daoTxHash: string }>();
  const token = localStorage.getItem("token");

  const [currentMember, setCurrentMember] = useState<IBackendDaoMember>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    nationalIdNo: "",
    memberRole: "",
    memberCustomIdentifier: crypto.randomUUID(),
  });
  useEffect(() => {
    let stepsCompleted = 0;

    if (currentMember.firstName) stepsCompleted++;
    if (memberAddr) stepsCompleted++;
    if (currentMember.phoneNumber) stepsCompleted++;
    if (currentMember.email) stepsCompleted++;
    if (currentMember.nationalIdNo) stepsCompleted++;

    setCompletedSteps(stepsCompleted);
  }, [
    currentMember,
    memberAddr,
    token,
  ]);

  // Consolidated onChange handler for all fields.
  const handleFieldChange = (field: keyof IBackendDaoMember) => (
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setCurrentMember((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload = {
      memberAddr,
      firstName: currentMember.firstName,
      lastName: currentMember.lastName,
      email: currentMember.email,
      phoneNumber: currentMember.phoneNumber,
      nationalIdNo: currentMember.nationalIdNo,
    };

    console.log("Payload:", payload);

    try {
      const response = await fetch(
        `${BASE_BACKEND_ENDPOINT_URL}/DaoKit/MemberShip/RequestToJoinDao/?daoTxHash=${daoTxHash}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": ROUTE_PROTECTOR_KEY,
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert("Registration successful");
        console.log(`Success: ${result.message}`);
        // Dispatch the current user information to the store
        dispatch(
          setCurrentUser({
            memberAddr: payload.memberAddr ?? null,
            firstName: payload.firstName,
            lastName: payload.lastName,
            email: payload.email,
            nationalIdNo: payload.nationalIdNo,
            phoneNumber: payload.phoneNumber,
          })
        );

        // Navigate to profile page based on role
        navigate(`/DaoProfile/${daoTxHash}`);
      } else {
        console.error("Member creation transaction failed");
        alert("Member creation failed. Please check your inputs and try again");
      }
    } catch (error) {
      console.error("Submission failed:", error);
    }
  };

  return (
    <>
      <NavBar className={"joinPlatformNav"} />
      <main className="daoRegistration join">
        <div className="funguaKikundi">
          <h1>Create, manage and fund community impact projects</h1>
          <p>
            Welcome to a one-stop platform for your
            <br /> DAO operations
          </p>
        </div>

        <div className="circle-container">
          {Array.from({ length: 5 }, (_, index) => (
            <React.Fragment key={`circle-${index}`}>
              <div
                className={`circle ${
                  index + 1 <= completedSteps ? "green" : ""
                }`}
              >
                {index + 1}
              </div>
              {index < 4 && <div className="line" />}
            </React.Fragment>
          ))}
        </div>

        <form className="combinedForms" onSubmit={handleSubmit}>
          <DaoForm
            className="form one"
            title="Tell us About yourself"
            description="Create a free account"
            fields={[
              {
                label: "First Name",
                type: "text",
                onChange: handleFieldChange("firstName"),
              },
              {
                label: "Last Name",
                type: "text",
                onChange: handleFieldChange("lastName"),
              },
              {
                label: "email",
                type: "email",
                onChange: handleFieldChange("email"),
              },
              {
                label: "Phone Number",
                type: "tel",
                onChange: handleFieldChange("phoneNumber"),
              },
              {
                label: "National Id",
                type: "number",
                onChange: handleFieldChange("nationalIdNo"),
              },
            ]}
          />

          <center>
            <button type="submit" className="createAccount">
              Submit
            </button>
          </center>
        </form>
      </main>
      <Footer className={""} />
    </>
  );
};

export default JoinPlatform;
