import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import DaoForm from "../components/DaoForm";
import ConnectWallet from "../components/auth/ConnectWallet";
import { useActiveAccount } from "thirdweb/react";

interface Dao {
  daoName: string;
  daoMultiSigAddr: string;
  // Add any other properties DAO objects have
}

const JoinPlatform: React.FC = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(""); // Default role
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState<number | "">("");
  const [nationalIdNo, setNationalIdNo] = useState<number | "">("");
  const [selectedDao, setSelectedDao] = useState(""); // Currently selected DAO
  const [currentStep, setCurrentStep] = useState(1);
  const [daos, setDaos] = useState<Dao[]>([]); // DAOs for selection
  const [multiSigAddr, setMultiSigAddr] = useState("");
  const [memberDaos, setMemberDaos] = useState<string[]>([]); // Array of all DAOs member belongs to

  const activeAccount = useActiveAccount();
  const memberAddr = activeAccount?.address;

  console.log("memberAddr:", memberAddr);
  console.log(selectedDao);

  useEffect(() => {
    if (role !== "Owner") {
      const fetchDaos = async () => {
        try {
          const response = await fetch(
            "http://localhost:8080/FunguaDao/GetDaoDetails"
          );

          if (!response.ok) {
            const errorText = await response.text();
            console.error("Failed to fetch DAOs. Response:", errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
          }

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
  }, [role]);

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

    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
      return;
    }

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
          ? 'http://localhost:8080/JiungeNaDao/DaoDetails/CreateOwner'
          : `http://localhost:8080/JiungeNaDao/DaoDetails/${multiSigAddr}/AddMember`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        console.log(`Success: ${result.message}`);
        navigate(role === "Owner" ? "/Owner" : "/Funder");
      } else {
        console.error(`Error: ${result.error}`);
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
          <p>Welcome to a one-stop platform for your DAO operations</p>
        </div>

        <div className="circle-container">
          {[1, 2, 3, 4, 5].map((step) => (
            <div key={step}>
              <div className={`circle ${currentStep >= step ? "filled" : ""}`}>
                {step}
              </div>
              {step < 5 && <div className="line"></div>}
            </div>
          ))}
        </div>

        <div className="hazina digitalWallet">
          <div className="left">
            <h2>Digital Wallet</h2>
            <p>Connect and fund impact DAOs and community saving groups</p>
          </div>
          <div className="formDiv">
            <ConnectWallet />
          </div>
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
                  { label: "Owner", value: "Owner" },
                  { label: "Member", value: "Member" },
                  { label: "Funder", value: "Funder" },
                ],
                onChange: handleRoleChange,
              },
            ]}
          />

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
                <option value="" disabled hidden>
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
            <button className="createAccount">
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
