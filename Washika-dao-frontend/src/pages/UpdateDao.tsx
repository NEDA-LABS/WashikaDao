import Footer from "../components/Footer";
import DaoForm from "../components/DaoForm";
import NavBar from "../components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
//import { DaoCreationFormInputs, daoCreationTxResult } from "../utils/Types";
import { prepareContractCall } from "thirdweb";
import { FullDaoContract } from "../utils/handlers/Handlers";
import { baseUrl } from "../utils/backendComm.ts";

/**
 * @Auth Policy -> Check if user is authenticated definitely should be before being allowed access to this page ---> If Dao Registration successful should be redirected to the page with the dao admin page
 */
interface FormData {
  daoName: string;
  daoLocation: string;
  targetAudience: string;
  daoTitle: string;
  daoDescription: string;
  daoOverview: string;
  daoImageIpfsHash: string;
  daoRegDocs: string;
  daoMultiSigAddr: string;
  multiSigPhoneNo: number;
  kiwango: number;
  accountNo: number;
  nambaZaHisa: string;
  kiasiChaHisa: string;
  interestOnLoans: string;
}

const uploadFileToCloudinary = async (file: File, resourceType: string) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "ml_default");

  const uploadUrl = `https://api.cloudinary.com/v1_1/da50g6laa/${resourceType}/upload`;

  try {
    const response = await fetch(uploadUrl, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    return data.secure_url; // Return the uploaded file's URL
  } catch (error) {
    console.error("Error uploading file:", error);
    return null;
  }
};

/**
 * DaoRegistration component allows users with the "Chairperson" role to register a new DAO.
 * It manages form data for DAO details and member information, handles file uploads to Cloudinary,
 * and submits the combined data to a backend API for DAO creation.
 *
 * @component
 * @returns {React.ReactElement} The rendered component.
 *
 * @remarks
 * - Utilizes React hooks for state management and side effects.
 * - Uses `useNavigate` from `react-router-dom` for navigation upon successful DAO creation.
 * - Relies on `useSelector` from `react-redux` to access user information from the Redux store.
 *
 * @requires ../components/Footer
 * @requires ../components/DaoForm
 * @requires ../components/NavBar
 * @requires ../components/MemberForm
 *
 * @example
 * <DaoRegistration />
 *
 * @see {@link https://reactjs.org/docs/hooks-intro.html} for more about React hooks.
 */
const UpdateDao: React.FC = () => {
  const navigate = useNavigate(); // Initialize navigation hook
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const currUsrAcc = useActiveAccount();
  const token = localStorage.getItem("token");
//   const [daoTxHash, setDaoTxHash] = useState("");
  const { daoMultiSig, memberAddr, phoneNumber } = useSelector(
    (state: RootState) => state.user
  );

  const daoMultiSigAddr = daoMultiSig

  useEffect(() => {
    if (typeof memberAddr === "string") {
      setFormData((prevData) => ({
        ...prevData,
        multiSigAddr: memberAddr.toLowerCase(),
      }));
    }
  }, [memberAddr]);

  const [formData, setFormData] = useState<FormData>({
    daoName: "",
    daoLocation: "",
    targetAudience: "",
    daoTitle: "",
    daoDescription: "",
    daoOverview: "",
    daoImageIpfsHash: "",
    daoRegDocs: "",
    daoMultiSigAddr: typeof memberAddr === "string" ? memberAddr : "",
    multiSigPhoneNo: phoneNumber,
    kiwango: 0,
    accountNo: 0,
    nambaZaHisa: "",
    kiasiChaHisa: "",
    interestOnLoans: "",
  });

  const [completedSteps, setCompletedSteps] = useState<number>(0);

  useEffect(() => {
    let stepsCompleted = 0;

    if (memberAddr) stepsCompleted++;
    if (formData.daoName) stepsCompleted++;
    if (formData.daoTitle) stepsCompleted++;
    if (formData.daoImageIpfsHash) stepsCompleted++;

    setCompletedSteps(stepsCompleted);
  }, [formData, memberAddr, phoneNumber]);

  // Handle changes in the main form fields
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target; // Destructure the target name and value
    setFormData((prevData) => ({
      ...prevData,
      [name]: value, // Update the specific field in the form data
    }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0]; // Access the file if it exists
    const fieldName = target.name;

    if (file) {
      const resourceType = fieldName === "daoImageIpfsHash" ? "image" : "raw"; // Use 'raw' for non-image files
      const fileUrl = await uploadFileToCloudinary(file, resourceType);

      if (fileUrl) {
        setFormData((prevData) => ({
          ...prevData,
          [fieldName]: fileUrl, // Update the specific field with the file URL
        }));
      }
    }
  };
  const currActiveAcc = useActiveAccount();
  const { mutate: sendTx, data: transactionResult } = useSendTransaction();

  //Grooming the Dao transaction
  const prepareCreateDaoTx = (_multiSigPhoneNo: bigint) => {
    if (!currActiveAcc) {
      console.error("Fatal Error, No Active Account found");
      return; //Failed to prepare transaction since amount isn't plugged in
    }
    try {
      console.log("Preparing dao Update transaction");
      const _createDaotx = prepareContractCall({
        contract: FullDaoContract,
        method: "createDao",
        params: [
          formData.daoName,
          formData.daoLocation,
          formData.targetAudience,
          formData.daoTitle,
          formData.daoDescription,
          formData.daoOverview,
          formData.daoImageIpfsHash,
          currActiveAcc.address, //multisig address
          BigInt(_multiSigPhoneNo?.toString() ?? "0"), //Convert to BigInt and handle undefined
        ],
      });
      console.log("Dao Update transaction prepared", _createDaotx);
      return _createDaotx;
    } catch (error) {
      console.error("Error preparing transaction:", error);
      return; //error caused the transaction to fail
    }
  };

  //function to now send the transaction
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sendCreateDaoTx = async (_createDaotx: any) => {
    if (!_createDaotx) {
      console.warn("undefined transaction");
      return;
    }
    try {
      console.log("Sending transaction...");
      sendTx(_createDaotx, {
        onSuccess: (receipt) => {
          console.log("Transaction successful!", receipt);
        //   setDaoTxHash(receipt.transactionHash);
          // window.location.href = `https://testnet.routescan.io/transaction/${receipt.transactionHash}`;
          console.log(`Current transaction result ${transactionResult}`);
        },
        onError: (error) => {
          console.error("Transaction failed:", error);
        },
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes("AA21")) {
        prompt(
          "Gas sponsorship issue, please top up your account or request for gas sponsorship"
        );
      } else {
        console.error("Error updating dao", error);
      }
    }
  };

  const handleCreateDao = async (): Promise<boolean> => {
    try {
      //Converting multisigPhoneNo to BigInt with default value
      const multisigPhoneNoBigInt = BigInt(formData.multiSigPhoneNo || "0");
      console.log(
        "Phone number to bind to multisig for dao",
        multisigPhoneNoBigInt
      );
      console.log("------------Now Calling prepareCreateDaoTx------------");
      const finalTx = prepareCreateDaoTx(multisigPhoneNoBigInt);
      if (finalTx) {
        await sendCreateDaoTx(finalTx);
        console.log("Transaction sent successfully");
        return true;
      } else {
        console.log("Looks like transaction failed");
        return false;
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes("AA21")) {
        prompt(
          "Gas sponsorship issue, please top up your account or request for gas sponsorship"
        );
      } else {
        console.error("Error updating dao", error);
      }
      return false;
    }
  };

    // Fetch DAO details on component mount
    useEffect(() => {
      const fetchDaoDetails = async () => {
        try {
          const response = await fetch(`http://${baseUrl}/Daokit/DaoDetails/GetDaoDetailsByMultisig/${daoMultiSigAddr}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          if (!response.ok) {
            throw new Error("Failed to fetch DAO details");
          }
          const data = await response.json();
          setFormData(data.daoDetails); // Populate form with existing data
          
        } catch (error) {
          console.error("Error fetching DAO details:", error);
        }
      };
  
      if (daoMultiSigAddr) {
        fetchDaoDetails();
      }
    }, [daoMultiSigAddr, token]);
    console.log(formData);

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission behavior
    // Ensure multiSigAddr is properly set
    // if (!formData.multiSigAddr || formData.multiSigAddr.trim() === "") {
    //  alert("MultiSig Address is required");
    //   return;
    // }
    if (!currActiveAcc) {
      alert("Member Address is required");
      return;
    }

    setIsSubmitting(true); // Set loading state to true
    try {
      // First, call handleCreateDao
      const isCreateDaoSuccessful = await handleCreateDao();
      if (isCreateDaoSuccessful === true) {
        // Send combined data to the backend API
        const response = await fetch(
          `http://${baseUrl}/Daokit/DaoDetails/UpdateDaoDetails/${daoMultiSigAddr}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
          }
        );
        const data = await response.json();
        console.log(data);
        // Parse the response JSON
        // Check if the response indicates success
        if (response.ok) {
          alert("Dao updated successfully");
          console.log("DAO updated successfully", data);

          navigate(`/SuperAdmin/${daoMultiSigAddr}`); // Navigate to the DAO profile pagehandleSubmit(event);
        } else {
          console.error("Error updating DAO:", data.message);
        }
      } else {
        console.error("DAO update transaction failed.");
        alert("DAO update failed. Please try again.");
      }
    } catch (error) {
      console.error("Error updating DAO:", error);
    } finally {
      setIsSubmitting(false); // Reset loading state
    }
  };
  //TODO: Fix below to check including role
  return (
    <>
      <NavBar className={"DaoRegister"} />
      {memberAddr ? ( // Only show form if user is logged in
        <main className="daoRegistration">
          <div className="funguaKikundi">
            <h1>
              GO ahead! <br />
              Update your DAO with a simple Step-by-step form
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
            <DaoForm
              className="form one"
              title="Update Dao"
              description="Update the details of your DAO"
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
                  value: formData.kiwango,
                  onChange: handleChange,
                },
                {
                  label: "Bank account number",
                  type: "number",
                  name: "accountNo",
                  value: formData.accountNo,
                  onChange: handleChange,
                },
              ]}
            />

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
                      type: "text",
                      name: "nambaZaHisa",
                      value: formData.nambaZaHisa,
                      onChange: handleChange,
                    },
                    {
                      label: "Amount per SHARE",
                      type: "text",
                      name: "kiasiChaHisa",
                      value: formData.kiasiChaHisa,
                      onChange: handleChange,
                    },
                    {
                      label: "Loan Interest",
                      type: "text",
                      name: "interestOnLoans",
                      value: formData.interestOnLoans,
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
                      value: formData.daoImageIpfsHash,
                      onChange: (e) =>
                        handleFileChange(
                          e as React.ChangeEvent<HTMLInputElement>
                        ), // File input handler
                    },
                    {
                      label: "Upload Registration Documents",
                      type: "file",
                      name: "daoRegDocs",
                      value: formData.daoRegDocs,
                      onChange: (e) =>
                        handleFileChange(
                          e as React.ChangeEvent<HTMLInputElement>
                        ), // File input handler
                    },
                  ],
                },
              ]}
            />

            <center>
              <button
                disabled={isSubmitting}
                className={`createDao ${isSubmitting ? "loading" : ""}`}
                type="submit"
              >
                Update DAO
              </button>
            </center>
          </form>
        </main>
      ) : (
        <p className="daoRegistration">
          Please log in to update your Dao Contract
        </p>
      )}
      <Footer className={""} />
    </>
  );
};

export default UpdateDao;
