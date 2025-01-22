import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import DaoForm from "../components/DaoForm";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../redux/users/userSlice";
import { useLocation } from "react-router-dom";

// import { ethers } from "ethers";
import React from "react";

interface Dao {
  daoName: string;
  daoMultiSigAddr: string;
}
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
  const [role, setRole] = useState(""); // Default role
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState<number | "">("");
  const [nationalIdNo, setNationalIdNo] = useState<number>();
  const [selectedDao, setSelectedDao] = useState(""); // Currently selected DAO
  const [daos, setDaos] = useState<Dao[]>([]); // DAOs for selection
  const [multiSigAddr, setMultiSigAddr] = useState("");
  const [memberDaos, setMemberDaos] = useState<string[]>([]); // Array of all DAOs member belongs to
  const [txHash, setTxHash] = useState("");
  // const [usrBal, setUsrBal] = useState("");
  const [completedSteps, setCompletedSteps] = useState<number>(0);
  const location = useLocation();
  const memberAddr = location.state?.address;
  console.log("The memberAddr is", memberAddr);

  useEffect(() => {
    if (role !== "Chairperson") {
      const fetchDaos = async () => {
        try {
          const response = await fetch(
            "http://localhost:8080/FunguaDao/GetDaoDetails"
          );

          if (!response.ok)
            throw new Error(`HTTP error! status: ${response.status}`);

          // Parse JSON data safely
          const data = await response.json();
          console.log("Fetched DAOs:", data);

          // Check if daoList exists and is an array
          if (Array.isArray(data.daoList)) {
            setDaos(data.daoList);
          } else {
            console.error("daoList is missing or not an array");
          }
        } catch (error) {
          console.error("Failed to fetch DAOs:", error);
        }
      };
      fetchDaos();
    }

    let stepsCompleted = 0;

    if (firstName) stepsCompleted++;
    if (memberAddr) stepsCompleted++;
    if (phoneNumber) stepsCompleted++;
    if (role) stepsCompleted++;
    if (daos.length > 0) stepsCompleted++;

    setCompletedSteps(stepsCompleted);
  }, [daos.length, firstName, memberAddr, phoneNumber, role]);

  const handleRoleChange = (
    event: React.ChangeEvent<
      HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    setRole(event.target.value);
  };

  const handleDaoChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDaoName = event.target.value;
    setSelectedDao(selectedDaoName);

    // Find the selected DAO in the list based on its name
    const chosenDao = daos.find((dao) => dao.daoName === selectedDaoName);

    if (chosenDao && !memberDaos.includes(chosenDao.daoName)) {
      setMemberDaos((prevDaos) => [...prevDaos, chosenDao.daoName]);
      setMultiSigAddr(chosenDao.daoMultiSigAddr); // Save selected DAO’s address
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Build payload data
    const payload = {
      memberAddr: memberAddr || "",
      firstName,
      lastName,
      email,
      phoneNumber: phoneNumber || 0,
      nationalIdNo: nationalIdNo || 0,
      memberRole: role,
      daoMultiSig: role === "Chairperson" ? memberAddr : multiSigAddr,
      memberDaos: role === "Chairperson" ? [] : memberDaos, // Leave empty if role is Owner
    };

    console.log("Payload:", payload);

    try {
      const endpoint =
        role === "Chairperson"
          ? "http://localhost:8080/JiungeNaDao/DaoDetails/CreateOwner"
          : `http://localhost:8080/JiungeNaDao/DaoDetails/${multiSigAddr.toLowerCase()}/AddMember`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      setTxHash(result.hash);
      console.log(txHash);

      if (response.ok) {
        console.log(`Success: ${result.message}`);
        // Dispatch the current user information to the store
        dispatch(
          setCurrentUser({
            memberAddr: payload.memberAddr,
            daoMultiSig: payload.daoMultiSig,
            firstName,
            lastName,
            email,
            role,
            nationalIdNo: payload.nationalIdNo,
            phoneNumber: payload.phoneNumber,
          })
        );

        // Navigate to profile page based on role
        navigate(
          role === "Chairperson" || role === "Member"
            ? `/Owner/${memberAddr.toLowerCase()}`
            : `/Funder/${memberAddr.toLowerCase()}`
        );
      } else {
        console.error(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Submission failed:", error);
    }
  };
  console.log(selectedDao);

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
                onChange: (e) => setFirstName(e.target.value),
              },
              {
                label: "Last Name",
                type: "text",
                onChange: (e) => setLastName(e.target.value),
              },
              {
                label: "email",
                type: "email",
                onChange: (e) => setEmail(e.target.value),
              },
              {
                label: "Phone Number",
                type: "number",
                onChange: (e) => setPhoneNumber(Number(e.target.value)),
              },
              {
                label: "National Id",
                type: "number",
                onChange: (e) => setNationalIdNo(Number(e.target.value)),
              },
              {
                label: "Role",
                type: "select",
                options: [
                  {
                    label: "Select Role",
                    value: "",
                    disabled: true,
                    selected: true,
                  },
                  { label: "Chairperson", value: "Chairperson" },
                  { label: "Member", value: "Member" },
                  { label: "Funder", value: "Funder" },
                ],
                onChange: handleRoleChange,
              },
            ]}
          />
          
          {role && role === "Member" && (
            <div className="findAndJoin">
              <div className="one">
                <h2>Find and join your DAO with ease</h2>
                <p>Find and connect with your DAO and start participating</p>
                <div className="image">
                  <img src="/images/Group.png" alt="group icon" />
                </div>
              </div>
              <select
                name="dao"
                id="dao"
                className="select-1"
                onChange={handleDaoChange}
                required
              >
                <option value="" disabled selected>
                  Select your DAO
                </option>
                {daos.map((dao) => (
                  <option key={dao.daoMultiSigAddr} value={dao.daoName}>
                    {dao.daoName}
                  </option>
                ))}
              </select>
            </div>
          )}

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
