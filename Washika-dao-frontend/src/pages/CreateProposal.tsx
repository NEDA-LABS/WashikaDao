import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
<<<<<<< HEAD

// 4 Blockchain
import {  useActiveAccount, useSendTransaction } from "thirdweb/react";
import {prepareContractCall, PreparedTransaction} from "thirdweb";
import { FullDaoContract } from "../utils/handlers/Handlers";

// 4 Backend Communication
=======
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import { prepareContractCall } from "thirdweb";
import { FullDaoContract } from "../utils/handlers/Handlers";
>>>>>>> 50ff9910c53519a309e7db9c3e0ec21469973b1d
import { baseUrl } from "../utils/backendComm";

/**
 *
 * @Auth policy: Check if user is authenticated before allowing access
 * @returns
 */
// Upload function for Cloudinary (as before)
/**
 * Uploads an image file to Cloudinary and returns the secure URL of the uploaded image.
 *
 * @param file - The image file to be uploaded.
 * @returns A promise that resolves to the secure URL of the uploaded image, or null if an error occurs.
 *
 * @throws Will log an error message to the console if the upload fails.
 */
const uploadDocumentToCloudinary = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "ml_default");

  try {
    const response = await fetch(
      "https://api.cloudinary.com/v1_1/da50g6laa/raw/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    return data.secure_url; // Return the URL of the uploaded image
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
};
/**
 * A React functional component that renders a form for creating a proposal.
 * It includes fields for proposal details such as title, summary, description,
 * amount requested, and status. The component also handles file uploads to
 * Cloudinary and form submission to a backend server.
 *
 * @component
 * @returns {JSX.Element} The rendered component.
 *
 * @remarks
 * - Utilizes React Router's `useNavigate` and `useParams` hooks for navigation
 *   and extracting URL parameters.
 * - Manages form state using React's `useState` hook.
 * - Handles file uploads by calling `uploadImageToCloudinary`.
 * - Submits form data to a specified backend endpoint.
 *
 * @throws Will log an error message to the console if the form submission fails.
 */
const CreateProposal: React.FC = () => {
    const navigate = useNavigate();
    const [completedSteps, setCompletedSteps] = useState<number>(0);
  // Extract multiSigAddr from URL params
  const { daoMultiSigAddr } = useParams<{ daoMultiSigAddr: string }>();
  console.log('the daoMultiSigAddr is', daoMultiSigAddr);
  
  const { memberAddr } = useSelector((state: RootState) => state.user);
<<<<<<< HEAD
    const token = localStorage.getItem("token");
=======
  const token = localStorage.getItem("token");
>>>>>>> 50ff9910c53519a309e7db9c3e0ec21469973b1d
  // State to manage form data
  const [proposalData, setProposalData] = useState({
    proposalCustomIdentifier: crypto.randomUUID(),
    proposalOwner: memberAddr,
    otherMember: "",
    proposalTitle: "",
    proposalSummary: "",
    proposalDescription: "",
    proposalStatus: "open", // default to 'open'
    amountRequested: "",
    profitSharePercent: "",
    daoMultiSigAddr: daoMultiSigAddr, // Populate daoMultiSigAddr from URL params
    numUpvotes: 0, // default value
    numDownvotes: 0, // default value
    fileUrl: "",
  });

  // Handle change for text fields and select dropdown
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setProposalData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle file upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const documentUrl = await uploadDocumentToCloudinary(file);
      if (documentUrl) {
        setProposalData((prevData) => ({
          ...prevData,
          fileUrl: documentUrl,
        }));
      }
    }
  };

  useEffect(() => {
    let stepsCompleted = 0;

    if (daoMultiSigAddr) stepsCompleted++;
    if (proposalData.amountRequested) stepsCompleted++;
    if (proposalData.proposalTitle) stepsCompleted++;
    if (proposalData.proposalDescription) stepsCompleted++;
    if (proposalData.fileUrl) stepsCompleted++;

    setCompletedSteps(stepsCompleted);
  }, [
    daoMultiSigAddr,
    proposalData.fileUrl,
    proposalData.proposalDescription,
    proposalData.amountRequested,
    proposalData.proposalTitle,
  ]);

<<<<<<< HEAD
    //Let's do some onchain stuff
 const currActiveAcc = useActiveAccount();
 const { mutate: sendTx, data: transactionResult } = useSendTransaction();
=======
  const currActiveAcc = useActiveAccount();
  const { mutate: sendTx, data: transactionResult } = useSendTransaction();
>>>>>>> 50ff9910c53519a309e7db9c3e0ec21469973b1d

  //url builder
  const buildCDExplorerUrl = (_createProposalTxHash: string) => {
    return `https:testnet.routescan.io/transaction/${_createProposalTxHash}`;
<<<<<<< HEAD
    };
    // Grooming the Proposal Transaction
 const prepareCreateProposalTx  = (_daoMultiSigAddr: string) => {
     if (currActiveAcc  === undefined) {
         console.error("undefined value for the current active account is not allowed");
            return;
        }
         try {
            console.log("Preparing Proposal Creation Transaction");
            const _createProposaltx = prepareContractCall({
                contract: FullDaoContract,
                method: "addProposal",
                params: [
                    _daoMultiSigAddr,
                    proposalData.proposalTitle,
                    proposalData.projectSummary,
                    proposalData.proposalDescription,
                    BigInt(proposalData.profitSharePercent),
                         ], });
     console.log(`Proposal Creation transaction prepared ${_createProposaltx} with result ${transactionResult}`);
        return _createProposaltx;
        }  catch (error) {
        console.error("Error Playing Transaction:", error);
        return; //error caused the transaction to fail
=======
  };
  //Grooming the Proposal transaction
  const prepareCreateProposalTx = (_daoMultiSigAddr: string) => {
    if (currActiveAcc == undefined) {
      console.error(
        "undefined value for current active account is not allowed"
      );
      return; //Failed to prepare transaction since amount isn't plugged in
>>>>>>> 50ff9910c53519a309e7db9c3e0ec21469973b1d
    }
    try {
      console.log("Preparing Proposal Creation transaction");
      const _createProposaltx = prepareContractCall({
        contract: FullDaoContract,
        method: "addProposal",
        params: [
          _daoMultiSigAddr,
          proposalData.proposalTitle,
          proposalData.proposalSummary,
          proposalData.proposalDescription,
          BigInt(proposalData.profitSharePercent),
        ],
      });
      console.log("Proposal Creation transaction prepared", _createProposaltx);
      console.log(transactionResult);
      return _createProposaltx;
    } catch (error) {
      console.error("Error preparing transaction:", error);
      return; //error caused the transaction to fail
    }
  };

<<<<<<< HEAD
 const  sendCreateProposalTx = async (_createProposaltx: PreparedTransaction) => {
      if (!_createProposaltx) {
            console.warn("undefined transaction");
            return;
        }

        try {
         sendTx(_createProposaltx, {
            onSuccess: (receipt) => {
            console.log("Transaction successful!", receipt);
            window.location.href = buildCDExplorerUrl(receipt.transactionHash);
            },
            onError: (error) => {
             if(error.message.includes("AA21")) {
                prompt("Gas sponsorship issue, please top up your account or request sponsorship."
                );
                } else {
                console.error("Error Creating Proposal", error);
}
},
});
        } catch(error) {
            console.error("Error sending transaction:", error);
        }
    };

 const handleCreateProposal = async () => {
    if (!daoMultiSigAddr) {
       console.log("Error, no multisig for the Dao provided");
       return false;
    }
     const finalTx = prepareCreateProposalTx(daoMultiSigAddr);
            if (finalTx) {
                await sendCreateProposalTx(finalTx as PreparedTransaction);
                    return true;
                  } else {
                    console.log("Transaction preparation failed");
                     return false;
        }
    };
=======
  //function to now send the transaction
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sendCreateProposalTx = async (_createProposaltx: any) => {
    if (!_createProposaltx) {
      console.warn("Undefined transaction");
      return;
    }

    try {
      sendTx(_createProposaltx, {
        onSuccess: (receipt) => {
          console.log("Transaction successful!", receipt);
          const _explorerUrl = buildCDExplorerUrl(receipt.transactionHash);
          console.log(_explorerUrl);
          
          // window.location.href = _explorerUrl;
        },
        onError: (error) => {
          if (error instanceof Error && error.message.includes("AA21")) {
            prompt(
              "Gas sponsorship issue, please top up your account or request sponsorship."
            );
          } else {
            console.error("Error creating proposal:", error);
          }
        },
      });
    } catch (error) {
      console.error("Error sending transaction:", error);
    }
  };

  const handleCreateProposal = async () => {
    if (daoMultiSigAddr) {
      const finalTx = prepareCreateProposalTx(daoMultiSigAddr);
      if (finalTx) {
        await sendCreateProposalTx(finalTx);
        return true;
      } else {
        console.log("Transaction preparation failed");
        return false;
      }
    }
  };
>>>>>>> 50ff9910c53519a309e7db9c3e0ec21469973b1d

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
<<<<<<< HEAD
     const isProposalCreationSuccess = await handleCreateProposal();
            if (isProposalCreationSuccess)  {
      const response = await fetch(
        `https://${baseUrl}/CreateProposal/DaoDetails/${daoMultiSigAddr}/createProposal`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,//include token in the Authorization header
          },
          body: JSON.stringify(proposalData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log(data);
        const proposalId = data.createdProposal?.proposalId;
        console.log("Proposal created successfully, ID:", proposalId);
        navigate(`/ViewProposal/${daoMultiSigAddr}/${proposalId}`);
=======
      const isCreateMemberSuccessfully = await handleCreateProposal();
      if (isCreateMemberSuccessfully === true) {
        const response = await fetch(
          `http://${baseUrl}/DaoKit/Proposals/CreateProposal`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            },
            body: JSON.stringify(proposalData),
          }
        );

        const data = await response.json();

        if (response.ok) {
          console.log(data);

          const proposalCustomIdentifier = data.createdProposal?.proposalCustomIdentifier;
          console.log("Proposal created successfully, ID:", proposalCustomIdentifier);
          console.log(daoMultiSigAddr, proposalCustomIdentifier);
          navigate(`/ViewProposal/${daoMultiSigAddr}/${proposalCustomIdentifier}`);
        } else {
          console.error(`Error: ${data.error}`);
        }
>>>>>>> 50ff9910c53519a309e7db9c3e0ec21469973b1d
      } else {
        console.error("Proposal creation transaction failed.");
        alert("Proposal creation failed. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
console.log(daoMultiSigAddr, proposalData.proposalCustomIdentifier);

  return (
    <>
      <NavBar className={"CreateProposal"} />
      <main className="createProposal">
        <div className="proposalParag">
          <div className="top">
            <h1>Create a proposal</h1>
            <img
              src="/images/arrow-back.png"
              alt="arrow-back"
              onClick={() => navigate(-1)}
            />
          </div>

          <p>
            Provide the information voters will need to make their decision
            here.
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

        <form onSubmit={handleSubmit}>
          <div className="label two">
            <label>Title of proposal</label>
            <input
              type="text"
              name="proposalTitle"
              value={proposalData.proposalTitle}
              onChange={handleChange}
            />
          </div>

          <div className="label three">
            <label>Summary of project</label>
            <textarea
              name="proposalSummary"
              value={proposalData.proposalSummary}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="label four">
            <label className="andika">
              Write a brief description about your proposal
            </label>
            <textarea
              name="proposalDescription"
              placeholder="Start here..."
              value={proposalData.proposalDescription}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="boxed">
            <div className="label five">
              <label>Amount Requested</label>
              <input
                type="number"
                name="amountRequested"
                value={proposalData.amountRequested}
                onChange={handleChange}
              />
            </div>
            <div className="label five two">
              <label>Interest on share %</label>
              <input
                type="number"
                name="profitSharePercent"
                value={proposalData.profitSharePercent}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="label">
            <label>Add another member (Optional)</label>
            <select
              name="proposalStatus"
              value={proposalData.otherMember}
              onChange={handleChange}
            >
              <option value="members">Members</option>
            </select>
          </div>

          <div className="six">
            <div>
              <input type="file" onChange={handleFileChange} />
            </div>
            <button type="submit">SUBMIT PROPOSAL</button>
          </div>
        </form>
      </main>
      <Footer className={""} />
    </>
  );
};

export default CreateProposal;
