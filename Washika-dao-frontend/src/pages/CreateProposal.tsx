import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

// 4 Blockchain
import { PayEmbed, useActiveAccount, useSendTransaction } from "thirdweb/react";
import { prepareContractCall } from "thirdweb";
import { FullDaoContract } from "../utils/handlers/Handlers";
import { instanceOf } from "prop-types";

// 4 Backend Communication
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
const uploadImageToCloudinary = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "ml_default");

  try {
    const response = await fetch(
      "https://api.cloudinary.com/v1_1/da50g6laa/image/upload",
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
  const { memberAddr } = useSelector((state: RootState) => state.user);
 const token = localStorage.getItem("token");
  // State to manage form data
  const [proposalData, setProposalData] = useState({
    proposalOwner: memberAddr,
    otherMember: "",
    proposalTitle: "",
    projectSummary: "",
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
      const imageUrl = await uploadImageToCloudinary(file);
      if (imageUrl) {
        setProposalData((prevData) => ({
          ...prevData,
          fileUrl: imageUrl,
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

    //Lets do some onchain stuff
 const currActiveAcc = useActiveAccount();
 const { mutate: sendTx, data: transactionResult } = useSendTransaction();

// Explorer Url Builder
 const buildCDExplorerUrl = (_createProposalTxHash: string) => {
    return `https:testnet.routescan.io/transaction/${_createProposalTxHash}`;
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
    ],
    });
     console.log("Proposal Creation transaction prepared", _createProposaltx);
     console.log(transactionResult);
        return _createProposaltx;
        }  catch (error) {
        console.error("Error Playing Transaction:", error);
        return; //error caused the transaction to fail
    }
    };

    //Function to now send the transaction
 const  sendCreateProposalTx = async (_createProposaltx: any) => {
      if (!_createProposaltx) {
            console.warn("undefined transaction");
            return;
        }

        try {
         sendTx(_createProposaltx, {
            onSuccess: (receipt) => {
            console.log("Transaction successful!", receipt);
            const _explorerUrl = buildCDExplorerUrl(receipt.transactionHash);
            window.location.href = _explorerUrl;
            },
            onError: (error) => {
             if(error instanceOf Error && error.message.includes("AA21")) {
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

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
     const isCreateMemberSuccessfully = await handleCreateProposal();
            if (isCreateMemberSuccessfully === true)  {
      const response = await fetch(
        `http://${baseUrl}/CreateProposal/DaoDetails/${daoMultiSigAddr}/createProposal`,
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
      } else {
        console.error(`Error, ${data.error}`);
      }
    } else {
        console.error("Proposal Creation transaction failed.");
        alert("Proposal creation failed. Please try again.");
    }
        } catch (error) {
      console.error("Error:", error);
    }
  };

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
              name="projectSummary"
              value={proposalData.projectSummary}
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
              <option value="members">
                Members
              </option>
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
