import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import DaoForm from "../components/DaoForm";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../redux/users/userSlice";
import { ethers } from "ethers";
import React from "react";

interface Dao {
  daoName: string;
  daoMultiSigAddr: string;
}

const JoinPlatform: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [role, setRole] = useState(""); // Default role
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState<number | "">("");
  const [nationalIdNo, setNationalIdNo] = useState<number | "">("");
  const [selectedDao, setSelectedDao] = useState(""); // Currently selected DAO
  const [daos, setDaos] = useState<Dao[]>([]); // DAOs for selection
  const [multiSigAddr, setMultiSigAddr] = useState("");
  const [memberDaos, setMemberDaos] = useState<string[]>([]); // Array of all DAOs member belongs to
  const [memberAddr, setMemberAddr] = useState("");
  const [txHash, setTxHash] = useState("");
  const [usrBal, setUsrBal] = useState("");
  const [completedSteps, setCompletedSteps] = useState<number>(0);

  // New function for login functionality
  const loginMember = async (event: React.FormEvent) => {
    event.preventDefault();
    const address = await connect();
    console.log({ address: address });

    if (!address) {
      console.error("Please connect your wallet first.");
      return;
    }
    try {
      const response = await fetch(
        "http://localhost:8080/JiungeNaDao/DaoDetails/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ memberAddr: address }),
        }
      );

      const result = await response.json();
      console.log(result.member);

      if (response.ok) {
        console.log("Login successful:", result.message);

        // Dispatch the user information to the Redux store
        dispatch(
          setCurrentUser({
            memberAddr: result.member.memberAddr,
            daoMultiSig: result.member.daoMultiSig || "",
            firstName: result.member.firstName,
            lastName: result.member.lastName,
            role: result.member.memberRole,
            phoneNumber: result.member.phoneNumber,
          })
        );

        // Verify that result.memberAddr is not undefined
        if (result?.member?.memberAddr) {
          navigate(
            result.member.memberRole === "Owner" ||
              result.member.memberRole === "Member"
              ? `/Owner/${result.member.memberAddr}`
              : `/Funder/${result.member.memberAddr}`
          );
        } else {
          console.error("Member address is undefined:", result);
        }
      } else {
        console.error("Login failed:", result.error);
      }
    } catch (error) {
      console.error("Login request failed:", error);
    }
  };

  async function connect() {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum, "any");
      const accounts = await provider.send("eth_requestAccounts", []);
      const account = accounts[0];
      const signer = await provider.getSigner();
      const address = await signer.getAddress(); // Get the address from the signer

      setMemberAddr(address);
      console.log({ account: account });

      const balance = await provider.getBalance(address);
      const balanceInEth = ethers.formatEther(balance);
      setUsrBal(balanceInEth);

      // Use window.ethereum.on for account change events
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          setMemberAddr(accounts[0]); // Update address on account change
          console.log("New address:", accounts[0]);
        }
      });

      return address; // Return the address to be used in the loginMember function
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      return null; // Return null if there's an error
    }
  }
  console.log({ usrBal: usrBal });

  useEffect(() => {
    if (role !== "Owner") {
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
      phoneNumber: phoneNumber || 0,
      nationalIdNo: nationalIdNo || 0,
      memberRole: role,
      daoMultiSig: role === "Owner" ? memberAddr : multiSigAddr,
      memberDaos: role === "Owner" ? [] : memberDaos, // Leave empty if role is Owner
    };

    console.log("Payload:", payload);

    try {
      const endpoint =
        role === "Owner"
          ? "http://localhost:8080/JiungeNaDao/DaoDetails/CreateOwner"
          : `http://localhost:8080/JiungeNaDao/DaoDetails/${multiSigAddr}/AddMember`;

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
            role,
            phoneNumber: 0,
          })
        );

        // Navigate to profile page based on role
        navigate(
          role === "Owner" || role === "Member"
            ? `/Owner/${memberAddr}`
            : `/Funder/${memberAddr}`
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
          <p>Welcome to a one-stop platform for your<br/> DAO operations</p>
        </div>

        <form className="hazina digitalWallet" onSubmit={loginMember}>
          <div className="formDiv">
            <p>Already have an account? Log in here</p>
            <button className="connectWallet" type="submit">
              Login
            </button>
          </div>
        </form>

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
                  { label: "Owner", value: "Owner" },
                  { label: "Member", value: "Member" },
                  { label: "Funder", value: "Funder" },
                ],
                onChange: handleRoleChange,
              },
            ]}
          />

          <div className="hazina digitalWallet">
            <div className="left">
              <h2>Digital Wallet</h2>
              <p>Connect and fund impact DAOs and community saving groups</p>
            </div>
            <div className="formDiv">
              <p>Connect To A Payment System of your choice</p>
              <button className="connectWallet" onClick={connect}>
                Connect Wallet
              </button>
            </div>
          </div>

          {role && role !== "Owner" && (
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
