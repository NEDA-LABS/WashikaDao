import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DaoForm from "../components/DaoForm";
import Footer from "../components/Footer";
import MemberForm from "../components/MemberForm";
import NavBar from "../components/Navbar/Navbar.tsx";
import { useDaoForm } from "../hooks/useDaoForm";
import { useCompletedSteps } from "../hooks/useDaoProgress.ts";
import { useDaoTransaction } from "../hooks/useDaoTransaction.ts";
import { useMemberManagement } from "../hooks/useMemberManagement";
import { useActiveAccount } from "thirdweb/react";
// import { BASE_BACKEND_ENDPOINT_URL, ROUTE_PROTECTOR_KEY } from "../utils/backendComm.ts";
// import { IBackendDaoMember } from "../utils/Types.ts";

// import { _routeScanRedirectUrlBuilder } from "../utils/blockchainUtils/blockchainComm.ts";

const DaoRegistration: React.FC = (): React.ReactNode => {
  const navigate = useNavigate(); // Initialize navigation hook
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  // const [daoTxHash, setDaoTxHash] = useState<string | null>(null);
  const activeAccount = useActiveAccount();
    const address = activeAccount?.address;
  const { currentMember, handleMemberChange, handleAddMember } =
    useMemberManagement();

  //const [daoCreationFormData, setDaoCreationFormData] = useState<IBackendDaoCreation>();

  // Pass the chairpersonPhone into the hook
  const { formData, setFormData, handleChange, handleFileChange } =
    useDaoForm();
  const completedSteps = useCompletedSteps(formData, address ?? null);
  const { handleCreateDao } = useDaoTransaction();

  /**
   * Step 1: Register DAO on the blockchain
   */
  const handleCreateDaoOnchain = async () => {
    if (!address) {
      alert("Member Address is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const daoTxHash = await handleCreateDao(formData, (data, txHash) => {
        console.log("DAO registered on-chain:", data, txHash);
      });

      if (!daoTxHash) {
        alert("DAO creation on blockchain failed!");
        setIsSubmitting(false);
        return;
      }

      // setDaoTxHash(txHash);
      // console.log(daoTxHash);
      
      const multiSigAddr = formData.daoMultiSigAddr || "";
      setFormData((prev) => ({
        ...prev,
        daoTxHash: daoTxHash,
        multiSigAddr
      }));
// console.log(formData);

      navigate(`/SuperAdmin/${multiSigAddr}`);
    } catch (error) {
      console.error("Error creating DAO on blockchain:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Step 2: Register DAO in the backend
   */
  // const handleSubmitDaoToBackend = async () => {
  //   if (!daoTxHash) {
  //     alert("DAO on-chain transaction missing!");
  //     return;
  //   }

  //   setIsSubmitting(true);
  //   try {
  //     const finalDaoData = {
  //       ...formData,
  //       daoTxHash, // Ensure transaction hash is sent
  //     };

  //     const response = await fetch(
  //       `${BASE_BACKEND_ENDPOINT_URL}/DaoGenesis/CreateDao?currentAddr=${address}`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           "X-API-KEY": ROUTE_PROTECTOR_KEY,
  //         },
  //         body: JSON.stringify(finalDaoData),
  //       }
  //     );

  //     const data = await response.json();
  //     if (response.ok) {
  //       alert("DAO successfully created in the backend!");
  //       console.log("DAO backend creation success:", data);
  //       setCurrentStep(3);
  //     } else {
  //       console.error("Backend DAO creation failed:", data.message);
  //     }
  //   } catch (error) {
  //     console.error("Error submitting DAO to backend:", error);
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  /**
   * Step 3: Register DAO members
   */
  // const handleMemberSubmit = async () => {
  //   if (!address) {
  //     alert("Member Address is required");
  //     return;
  //   }

  //   setIsSubmitting(true);
  //   try {
  //     const response = await fetch(
  //       `${BASE_BACKEND_ENDPOINT_URL}/DaoGenesis/CreateDao?currentAddr=${address}`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           "X-API-KEY": ROUTE_PROTECTOR_KEY,
  //         },
  //         body: JSON.stringify(formData),
  //       }
  //     );

  //     const data = await response.json();
  //     if (response.ok) {
  //       alert("DAO successfully created in the backend!");
  //       console.log("DAO backend creation success:", data);
  //       navigate(`/SuperAdmin/${daoTxHash}`);
  //     } else {
  //       console.error("Backend DAO creation failed:", data.message);
  //     }
  //   } catch (error) {
  //     console.error("Error submitting DAO to backend:", error);
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

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
                  label: "Target Audience",
                  type: "text",
                  name: "targetAudience",
                  value: formData.targetAudience,
                  onChange: handleChange,
                },
                {
                  label: "What is your Savings Group about?",
                  type: "textarea",
                  name: "daoDescription",
                  value: formData.daoDescription,
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
                  label: "Additional information if any and Group By-laws",
                  type: "textarea",
                  name: "daoOverview",
                  value: formData.daoOverview,
                  onChange: handleChange,
                },
                {
                  label: "Bank account number",
                  type: "text",
                  name: "accountNo",
                  value: formData.accountNo,
                  onChange: handleChange,
                },
                // {
                //   label: "Initial Amount",
                //   type: "number",
                //   name: "kiwango",
                //   value: formData.kiwango === 0 ? "" : formData.kiwango,
                //   onChange: handleChange,
                // },
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
            <center>
              <button
                disabled={isSubmitting}
                className={`createDao ${isSubmitting ? "loading" : ""}`}
                onClick={handleCreateDaoOnchain}
              >
                Save On-Chain
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
              onAddMember={handleAddMember}
            />
            <center>
              <button
                disabled={isSubmitting}
                className={`createDao ${isSubmitting ? "loading" : ""}`}
                type="button"
                // onClick={handleMemberSubmit}
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

  const LoadingPopup = () => (
    <div className="loading-popup">
      <div className="loading-content">
        <p>Creating DAO on-chain...</p>
        <div className="spinner" />
      </div>
    </div>
  );
  

  return (
    <div className="fullheight">
      <NavBar className={"DaoRegister"} />
      {isSubmitting && <LoadingPopup />}
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
            {Array.from({ length: 4 }, (_, index) => (
              <React.Fragment key={`circle-${index}`}>
                <div
                  className={`circle ${
                    index + 1 <= completedSteps ? "green" : ""
                  }`}
                >
                  {index + 1}
                </div>
                {index < 3 && <div className="line" />}
              </React.Fragment>
            ))}
          </div>

          <form className="combinedForms">{renderStep()}</form>
        </main>
      ) : (
        <p className="daoRegistration error">
          Please log in to create a Dao Contract
        </p>
      )}
      <Footer className={""} />
    </div>
  );
};

export default DaoRegistration;
