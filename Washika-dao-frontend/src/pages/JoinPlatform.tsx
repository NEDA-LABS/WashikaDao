import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import NavBar from "../components/Navbar/Navbar";
import DaoForm from "../components/DaoForm";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../redux/users/userSlice";
import { useLocation } from "react-router-dom";

import React from "react";

// 4 Blockchain
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import { FullDaoContract } from "../utils/handlers/Handlers";
import { prepareContractCall } from "thirdweb";
import { baseUrl } from "../utils/backendComm";
import { Dao, fetchDaos } from "../hooks/fetchDaos";

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
  const [daos, setDaos] = useState<Dao[]>([]); // DAOs for selection
  const [multiSigAddr, setMultiSigAddr] = useState("");
  const [multiSigPhoneNo, setMultiSigPhoneNo] = useState<bigint>();
  const [memberDaos, setMemberDaos] = useState<string[]>([]); // Array of all DAOs member belongs to
  const [txHash, setTxHash] = useState("");
  // const [usrBal, setUsrBal] = useState("");
  const [completedSteps, setCompletedSteps] = useState<number>(0);
  const location = useLocation();
  const memberAddr = location.state?.address;
  const token = localStorage.getItem("token");
  console.log("The memberAddr is", memberAddr);

  const currActiveAcc = useActiveAccount();
  const { mutate: sendTx, data: transactionResult } = useSendTransaction();

  const prepareJoinPlatformTx = (
    _memberName: string,
    _emailAddress: string,
    _phoneNumber: bigint,
    _nationalId: bigint,
    _role: string,
    _daoMultiSigAddr: string,
    _userAddress: string,
    _multiSigPhoneNo: bigint
  ) => {
    if (!currActiveAcc) {
      console.error("Fatal Error, No Active Account found");
      return;
    }
    try {
      console.log("Preparing JoinPlatform transaction");
      const _addMemberTx = prepareContractCall({
        contract: FullDaoContract,
        method: "addMember",
        params: [
          _memberName,
          _emailAddress,
          _phoneNumber,
          _nationalId,
          _role,
          _userAddress,
          _daoMultiSigAddr,
          _multiSigPhoneNo,
        ],
      });
      console.log("Prepared transaction:", _addMemberTx);
      return _addMemberTx;
    } catch (error) {
      console.error("Error preparing transaction:", error);
      return;
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sendJoinPlatformTx = async (_addMemberTx: any) => {
    if (!_addMemberTx) {
      console.warn("undefined transaction");
      return;
    }
    try {
      console.log("Sending transaction...");
      sendTx(_addMemberTx, {
        onSuccess: (receipt) => {
          console.log("Transaction successful!", receipt);
          setTxHash(receipt.transactionHash);
          window.location.href = `https://testnet.routescan.io/transaction/${txHash}`;
          console.log(`Current transaction result ${transactionResult}`);
        },
        onError: (error) => {
          console.error("Transaction failed:", error);
        },
      });
    } catch (error) {
      console.error("Error sending transaction:", error);
      if (error instanceof Error && error.message.includes("AA21")) {
        alert("Gas sponsorship issue. Please top up or request sponsorship.");
      }
    }
  };

  const handleJoinPlatform = async () => {
    const phoneNumberBigInt = BigInt(phoneNumber || "0");
    const nationalIdBigInt = BigInt(nationalIdNo || "0");
    const multiSigPhoneNoBigInt = BigInt(multiSigPhoneNo || "0");

    const finalTx = prepareJoinPlatformTx(
      firstName + " " + lastName,
      email,
      phoneNumberBigInt,
      nationalIdBigInt,
      role,
      multiSigAddr,
      memberAddr,
      multiSigPhoneNoBigInt
    );
    if (finalTx) {
      await sendJoinPlatformTx(finalTx);
      return true;
    } else {
      console.log("Transaction preparation failed");
      return false;
    }
  };

  useEffect(() => {
    if (role === "Member") {
      const getDaos = async () => {
        const daoList = await fetchDaos();
        setDaos(daoList);
      };
      getDaos();
    }

    let stepsCompleted = 0;

    if (firstName) stepsCompleted++;
    if (memberAddr) stepsCompleted++;
    if (phoneNumber) stepsCompleted++;
    if (role) stepsCompleted++;
    if (daos.length > 0) stepsCompleted++;

    setCompletedSteps(stepsCompleted);
  }, [daos.length, firstName, memberAddr, phoneNumber, role, token]);

  const handleRoleChange = (
    event: React.ChangeEvent<
      HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    setRole(event.target.value);
  };

  const handleDaoChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDaoName = event.target.value;

    // Find the selected DAO in the list based on its name
    const chosenDao = daos.find((dao) => dao.daoName === selectedDaoName);

    if (chosenDao && !memberDaos.includes(chosenDao.daoName)) {
      setMemberDaos((prevDaos) => [...prevDaos, chosenDao.daoName]);
      setMultiSigAddr(chosenDao.daoMultiSigAddr); // Save selected DAO’s address
      setMultiSigPhoneNo(chosenDao.multiSigPhoneNo);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

  type UserStateT = {
         memberAddr: string | any,
         firstName: string,
         lastName: string,
         email: string,
         phoneNumber: number | bigint | any,
         nationalIdNo: number | string | bigint | any,
         memberRole: string | any,
        daoMultiSigAddr: string | any,
        daos: string[] | string | any,
        }

    // Build payload data
    const payload : UserStateT = {
      memberAddr: memberAddr || "",
      firstName,
      lastName,
      email,
      phoneNumber: phoneNumber || 0,
      nationalIdNo: nationalIdNo || 0,
      memberRole: role,
      daoMultiSigAddr: role === "Chairperson" ? memberAddr : multiSigAddr,
      daos: role === "Chairperson" ? [] : memberDaos, // Leave empty if role is Owner
    };

    console.log("Payload:", payload);

    try {
      const isCreateMemberSuccessfully = await handleJoinPlatform();
      if (isCreateMemberSuccessfully === true) {
        const endpoint =
          role === "Chairperson"
            ? `http://${baseUrl}/DaoKit/MemberShip/CreateInitialOwner`
            : `http://${baseUrl}/DaoKit/MemberShip/RequestToJoinDao`;

        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (response.ok) {
          alert("Registration successful");
          console.log(`Success: ${result.message}`);
          // Dispatch the current user information to the store
          dispatch(
            setCurrentUser({
              memberAddr: payload.memberAddr,
              firstName,
              lastName,
              email,
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
      } else {
        console.error("Member creation transaction failed");
            alert("Member creation failed. Please check your inputs and try again");
            }
    } catch (error) {
      console.error("Submission failed:", error);
    }}

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
                type: "tel",
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
