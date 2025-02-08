import Footer from "../components/Footer";
import DaoForm from "../components/DaoForm";
import NavBar from "../components/NavBar.tsx";
import MemberForm from "../components/MemberForm";
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
  multiSigAddr: string;
  multiSigPhoneNo: number;
  kiwango: number;
  accountNo: number;
  nambaZaHisa: string;
  kiasiChaHisa: string;
  interestOnLoans: string;

}

interface Member {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  nationalIdNo: string;
  memberRole: string;
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
const DaoRegistration: React.FC = () => {
  const navigate = useNavigate(); // Initialize navigation hook
  const [isSubmitting, setIsSubmitting] = useState(false);
  const currUsrAcc = useActiveAccount();
  const token = localStorage.getItem("token");
  const [daoTxHash, setDaoTxHash] = useState("");
  const { memberAddr, phoneNumber } = useSelector(
    (state: RootState) => state.user
  );
  console.log(daoTxHash);
  

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
    multiSigAddr: typeof memberAddr === "string" ? memberAddr : "",
    multiSigPhoneNo: phoneNumber,
    kiwango: 0,
    accountNo: 0,
    nambaZaHisa: "",
    kiasiChaHisa: "",
    interestOnLoans: "",
  });

  // State to hold the list of members
  const [members, setMembers] = useState<Member[]>([]);

  // Temporary state to hold the current member's input values
  const [currentMember, setCurrentMember] = useState<Member>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    nationalIdNo: "",
    memberRole: "",
  });
  const [completedSteps, setCompletedSteps] = useState<number>(0);

  useEffect(() => {
    let stepsCompleted = 0;

    if (memberAddr) stepsCompleted++;
    if (formData.daoName) stepsCompleted++;
    if (formData.daoTitle) stepsCompleted++;
    if (formData.daoImageIpfsHash) stepsCompleted++;
    if (members.length > 0) stepsCompleted++;

    setCompletedSteps(stepsCompleted);
  }, [formData, memberAddr, members.length, phoneNumber]);

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

  // Handle change for members
  const handleMemberChange = (field: keyof Member, value: string) => {
    setCurrentMember((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Function to add a member to the members list
  const handleAddAndInviteMember = async () => {
    if (
      currentMember.firstName &&
      currentMember.lastName &&
      currentMember.phoneNumber &&
      currentMember.nationalIdNo &&
      currentMember.memberRole
    ) {
      // Push the current member to the members array
      setMembers([...members, currentMember]);

      try {
        const daoMultiSigAddr = formData.multiSigAddr;
        // Send an email to the new member
        const response = await fetch(
          `http://${baseUrl}/DaoKit/MemberShip/InviteMemberEmail/$${daoMultiSigAddr}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              email: currentMember.email,
              firstName: currentMember.firstName,
            }),
          }
        );
  
        if (response.ok) {
          alert("Member added and email sent successfully.");
        } else {
          console.error("Failed to send email.");
        }
      } catch (error) {
        console.error("Error:", error);
      }

      // Clear the currentMember form for new input
      setCurrentMember({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        nationalIdNo: "",
        memberRole: "",
      });
    }
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
      console.error(
        "Fatal Error Occurred, No Active Account Found"
      );
      return false; //Failed to prepare transaction since account isn't plugged in
    }

    try {
      console.log("Preparing dao Creation transaction");
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
      console.log("Dao Creation transaction prepared", _createDaotx);
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
      console.warn("Error, attempted undefined transaction");
      return;
    }
    try {
     console.log("Sending Transaction");

       sendTx(_createDaotx, {
        onSuccess: (receipt) => {
            console.log("Transaction successful!", receipt
            );
     setDaoTxHash(receipt.transactionHash);
    //  window.location.href = `https://testnet.routescan.io/transaction/${daoTxHash}`;
    console.log(`Current transaction result ${transactionResult}`);
     },
      onError: (error) => {
        console.error("Unfortunately, it occurs that the Transaction failed!", error);
    },
            });
    } catch (error) {
      if (error instanceof Error && error.message.includes("AA21")) {
        prompt(
          "Gas sponsorship issue, please top up your account or request for gas sponsorship"
        );
      } else {
        console.error("Error creating dao", error);
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
      const finalTx =  prepareCreateDaoTx(multisigPhoneNoBigInt);
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
        console.error("Error creating dao", error);
      }
      return false;
    }
  };

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
        // Combine form data and member data
        const combinedData = {
          ...formData,
          members,
        };

        // Send combined data to the backend API
        const response = await fetch(
         `http://${baseUrl}/DaoGenesis/CreateDao`,
          {
            method: "POST", // HTTP method
            headers: {
              "Content-Type": "application/json", // Specify JSON content type
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(combinedData), // Send combined data
          }
        );
        const data = await response.json();
        console.log(data);
        // Parse the response JSON
        // Check if the response indicates success
        if (response.ok) {
          alert("Dao created successfully");
          console.log("DAO created successfully", data);
          const daoMultiSigAddr = data.daoMultisigAddr; // Extract multi-sig address from response
          console.log(daoMultiSigAddr);

          navigate(`/SuperAdmin/${daoMultiSigAddr}`); // Navigate to the DAO profile pagehandleSubmit(event);
        } else {
          console.error("Error creating DAO:", data.message);
        }
      } else {
        console.error("DAO creation transaction failed.");
        alert("DAO creation failed. Please try again.");
      }
    } catch (error) {
      console.error("Error creating DAO:", error);
    } finally {
      setIsSubmitting(false); // Reset loading state
    }
  };
  //TODO: Fix below to check including role
  return (
    <>
      <NavBar className={"DaoRegister"} />
      {currUsrAcc ? ( // Only show form if user is logged in
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
                      onChange: (e) =>
                        handleFileChange(
                          e as React.ChangeEvent<HTMLInputElement>
                        ), // File input handler
                    },
                    {
                      label: "Upload Registration Documents",
                      type: "file",
                      name: "daoRegDocs",
                      onChange: (e) =>
                        handleFileChange(
                          e as React.ChangeEvent<HTMLInputElement>
                        ), // File input handler
                    },
                  ],
                },
              ]}
            />

            {/* Pass members state and handlers to the MemberForm */}
            <MemberForm
              currentMember={currentMember}
              onMemberChange={handleMemberChange}
              onAddAndInviteMember={handleAddAndInviteMember}
            />

            <center>
              <button
                disabled={isSubmitting}
                className={`createDao ${isSubmitting ? "loading" : ""}`}
                type="submit"
              >
                Create DAO
              </button>
            </center>
          </form>
        </main>
      ) : (
        <p className="daoRegistration">
          Please log in to create a Dao Contract
        </p>
      )}
      <Footer className={""} />
    </>
  );
};

export default DaoRegistration;
