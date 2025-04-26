import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Step1Form from "../components/DaoRegistration/Step1Form";
// import Step2Form from "../components/DaoRegistration/Step2Form";
// import Step3Members from "../components/DaoRegistration/Step3Members";
import LoadingPopup from "../components/DaoRegistration/LoadingPopup";
import NavBar from "../components/Navbar/Navbar.tsx";
import { useDaoForm } from "../hooks/useDaoForm";
import { useCompletedSteps } from "../hooks/useDaoProgress.ts";
import { useDaoTransaction } from "../hooks/useDaoTransaction.ts";
// import { useMemberManagement } from "../hooks/useMemberManagement";
import { useActiveAccount } from "thirdweb/react";
// import {  BASE_BACKEND_ENDPOINT_URL,  ROUTE_PROTECTOR_KEY} from "../utils/backendComm.ts";
// import { IBackendDaoMember } from "../utils/Types.ts";

// import { _routeScanRedirectUrlBuilder } from "../utils/blockchainUtils/blockchainComm.ts";

const DaoRegistration: React.FC = (): React.ReactNode => {
  const navigate = useNavigate(); // Initialize navigation hook
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [currentStep, setCurrentStep] = useState(1);
  // const [daoTxHash, setDaoTxHash] = useState<string | null>(null);
  const activeAccount = useActiveAccount();
  const address = activeAccount?.address;
  // const { currentMember, handleMemberChange, handleAddMember } = useMemberManagement();

  //const [daoCreationFormData, setDaoCreationFormData] = useState<IBackendDaoCreation>();

  // Pass the chairpersonPhone into the hook
  const { formData, setFormData, handleChange } = useDaoForm();
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
        multiSigAddr,
      }));
      // console.log(formData);

      navigate(`/SuperAdmin/${multiSigAddr}`);
    } catch (error) {
      console.error("Error creating DAO on blockchain:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsSubmitting(false);
    alert("Transaction canceled by user.");
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
  //       // navigate(`/SuperAdmin/${daoTxHash}`);
  //     } else {
  //       console.error("Backend DAO creation failed:", data.message);
  //     }
  //   } catch (error) {
  //     console.error("Error submitting DAO to backend:", error);
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  // const renderStep = () => {
  //   switch (currentStep) {
  //    
  //     case 2:
  //       return (
  //         <Step2Form
  //           formData={formData}
  //           handleChange={handleChange}
  //           handleFileChange={handleFileChange}
  //           onSubmit={handleCreateDaoOnchain}
  //           isSubmitting={isSubmitting}
  //         />
  //       );
  //     case 3:
  //       return (
  //         <Step3Members
  //           currentMember={currentMember}
  //           onMemberChange={handleMemberChange}
  //           onAddMember={handleAddMember}
  //           onSubmit={handleMemberSubmit}
  //           isSubmitting={isSubmitting}
  //         />
  //       );
  //     default:
  //       return null;
  //   }
  // };

  return (
    <div className="fullheight">
      <NavBar className={"DaoRegister"} />
      {isSubmitting && <LoadingPopup message="Creating DAO on-chain..." onCancel={handleCancel} />}
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

          <form className="combinedForms">
            <Step1Form
              formData={formData}
              handleChange={handleChange}
              onSubmit={handleCreateDaoOnchain}
              isSubmitting={isSubmitting}
            />
          </form>
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
