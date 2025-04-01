import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import DaoForm from "../components/DaoForm";
import Footer from "../components/Footer";
import MemberForm from "../components/MemberForm";
import NavBar from "../components/Navbar/Navbar.tsx";
import { useDaoForm } from "../hooks/useDaoForm";
import { useCompletedSteps } from "../hooks/useDaoProgress.ts";
import { useDaoTransaction } from "../hooks/useDaoTransaction.ts";
import { useMemberTransaction } from "../hooks/useMemberTransaction.ts";
import { useMemberManagement } from "../hooks/useMemberManagement";
import { RootState } from "../redux/store.ts";
// import { BASE_BACKEND_ENDPOINT_URL, ROUTE_PROTECTOR_KEY } from "../utils/backendComm.ts";
// import { IBackendDaoMember } from "../utils/Types.ts";

// import { _routeScanRedirectUrlBuilder } from "../utils/blockchainUtils/blockchainComm.ts";

const DaoRegistration: React.FC = (): React.ReactNode => {
  const navigate = useNavigate(); // Initialize navigation hook
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  // const [newDaoTxHash, setNewDaoTxHash] = useState("");
  const address = useSelector((state: RootState) => state.auth.address);
  const { currentMember, handleMemberChange, saveMember } =
    useMemberManagement();

  //const [daoCreationFormData, setDaoCreationFormData] = useState<IBackendDaoCreation>();
  // Find the chairperson member (if any)
  // const chairperson = members.find(
  //   (member) => member.memberRole === "Chairperson"
  // );
  // const chairpersonPhone = chairperson ? chairperson.phoneNumber : "";

  // Pass the chairpersonPhone into the hook
  const { formData, setFormData, handleChange, handleFileChange } =
    useDaoForm("0");
  const completedSteps = useCompletedSteps(formData, [], address);
  const { handleCreateDao } = useDaoTransaction();
  const { handleRegisterMember } = useMemberTransaction();

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission behavior

    if (currentStep !== 2) return;

    if (!address) {
      alert("Member Address is required");
      return;
    }

    setIsSubmitting(true); // Set loading state to true
    try {
      //Sending the Transaction to send the data to create the Dao Onchain first
      const daoTxHash = await handleCreateDao(formData, (data, txHash) => {
        console.log("Dao registered:", data, txHash);
      });
      if (!daoTxHash) {
        alert("DAO creation on blockchain failed!");
        setIsSubmitting(false);

        return;
      }

      // setNewDaoTxHash(daoTxHash);
      setFormData((prev) => ({ ...prev, daoTxHash }));
      //  const redirectUrl = _routeScanRedirectUrlBuilder(newDaoTxHash);

      setCurrentStep(3);

      setIsSubmitting(false);

      //  const combinedData = {
      //     ...formData,
      //     daoTxHash,
      //   };
      //On Success of the blockchain part,
      // Send combined data to the backend API
      //     const response = await fetch(`${BASE_BACKEND_ENDPOINT_URL}/DaoGenesis/CreateDao?currentAddr=${address}`, {
      //       method: "POST", // HTTP method
      //       headers: {
      //         "Content-Type": "application/json", // Specify JSON content type
      //         "X-API-KEY": ROUTE_PROTECTOR_KEY,

      // },

      //       body: JSON.stringify(combinedData),
      //     });

      // const data = await response.json();
      // console.log(data);
      // Parse the response JSON
      // Check if the response indicates success
      // if (response.ok) {
      //   alert("Dao created successfully");
      //   console.log("DAO created successfully", data);
      //   navigate(`/SuperAdmin/${daoTxHash}`); // Navigate to the DAO profile pagehandleSubmit(event);
      // } else {
      //   console.error("Error creating DAO:", data.message);
      // }
    } catch (error) {
      console.warn(
        "Error Creating Dao onchain or sending the data to our api, please study the error to learn more",
        error
      );
      setIsSubmitting(false); // Reset loading state
    }
  };

  const handleMemberSubmit = async () => {
    if (!address) {
      alert("Member Address is required");
      return;
    }

    if (!(await saveMember())) return;

    setIsSubmitting(true);
    try {
      const memberTxHash = await handleRegisterMember(currentMember, (member, txHash) => {
        console.log("Member registered:", member, txHash);
        navigate(`/SuperAdmin/${formData.daoTxHash}`);
      });
      if (!memberTxHash) {
        alert("Member creation on blockchain failed!");
        setIsSubmitting(false);
        return;
      }
    } catch (error) {
      console.warn("Error creating member onchain:", error);
      setIsSubmitting(false);
    }
  };


  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step step1">
            <DaoForm
              className="form one"
              title="Fill this form to your DAO"
              description="Tell us about your group"
              fields={[
                {
                  label: "Name of your Group",
                  type: "text",
                  name: "daoName",
                  value: formData.daoName,
                  onChange: handleChange,
                },
                {
                  label: "Location",
                  type: "text",
                  name: "daoLocation",
                  value: formData.daoLocation,
                  onChange: handleChange,
                },
                {
                  label: "What is your Savings Group about?",
                  type: "text",
                  name: "targetAudience",
                  value: formData.targetAudience,
                  onChange: handleChange,
                },
                {
                  label: "Initial Amount",
                  type: "number",
                  name: "kiwango",
                  value: formData.kiwango === 0 ? "" : formData.kiwango,
                  onChange: handleChange,
                },
                {
                  label: "Bank account number",
                  type: "text",
                  name: "accountNo",
                  value: formData.accountNo,
                  onChange: handleChange,
                },
              ]}
            />
            <div className="form-progress">
              <button type="button" onClick={() => setCurrentStep(2)}>
                Next
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="step step2">
            <DaoForm
              className="form two"
              title="About the group"
              description="Group overview and its objective"
              fields={[
                {
                  label: "Header Bio",
                  type: "text",
                  name: "daoTitle",
                  value: formData.daoTitle,
                  onChange: handleChange,
                },
                {
                  label: "Short description",
                  type: "textarea",
                  name: "daoDescription",
                  value: formData.daoDescription,
                  onChange: handleChange,
                },
                {
                  label: "Additional information if any and Group By-laws",
                  type: "textarea",
                  name: "daoOverview",
                  value: formData.daoOverview,
                  onChange: handleChange,
                },
                {
                  group: true,
                  fields: [
                    {
                      label: "Number of SHARES",
                      type: "number",
                      name: "nambaZaHisa",
                      value:
                        formData.nambaZaHisa === 0 ? "" : formData.nambaZaHisa,
                      onChange: handleChange,
                    },
                    {
                      label: "Amount per SHARE",
                      type: "number",
                      name: "kiasiChaHisa",
                      value:
                        formData.kiasiChaHisa === 0
                          ? ""
                          : formData.kiasiChaHisa,
                      onChange: handleChange,
                    },
                    {
                      label: "Loan Interest",
                      type: "number",
                      name: "interestOnLoans",
                      value:
                        formData.interestOnLoans === 0
                          ? ""
                          : formData.interestOnLoans,
                      placeholder: "%",
                      onChange: handleChange,
                    },
                  ],
                  label: "",
                  type: "",
                },
                {
                  label: "",
                  type: "",
                  group: true,
                  fields: [
                    {
                      label: "Profile Image",
                      type: "file",
                      name: "daoImageIpfsHash",
                      onChange: (e) =>
                        handleFileChange(
                          e as React.ChangeEvent<HTMLInputElement>
                        ),
                    },
                    {
                      label: "Upload Registration Documents",
                      type: "file",
                      name: "daoRegDocs",
                      onChange: (e) =>
                        handleFileChange(
                          e as React.ChangeEvent<HTMLInputElement>
                        ),
                    },
                  ],
                },
              ]}
            />
            <div className="form-progress">
              <button type="button" onClick={() => setCurrentStep(1)}>
                Back
              </button>
            </div>
            <center>
              <button
                disabled={isSubmitting}
                className={`createDao ${isSubmitting ? "loading" : ""}`}
                type="submit"
              >
                Create DAO
              </button>
            </center>
          </div>
        );
      case 3:
        return (
          <div className="step step3">
            <MemberForm
              currentMember={currentMember}
              onMemberChange={handleMemberChange}
            />
            <center>
              <button
                disabled={isSubmitting}
                className={`createDao ${isSubmitting ? "loading" : ""}`}
                 type="button"
                 onClick={handleMemberSubmit}
              >
                Create Account
              </button>
            </center>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <NavBar className={"DaoRegister"} />
      {address ? ( 
        <main className="daoRegistration">
          <div className="funguaKikundi">
            <h1>
              Start here! <br />
              Open your DAO with a simple Step-by-step form
            </h1>
            <p>
              Our platform allows you to manage and govern <br />
              your savings group with ease and transparency
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
            {renderStep() /* Render the current step */}
          </form>
        </main>
      ) : (
        <p className="daoRegistration error">
          Please log in to create a Dao Contract
        </p>
      )}
      <Footer className={""} />
    </>
  );
};

export default DaoRegistration;
