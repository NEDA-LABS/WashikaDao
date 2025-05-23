// Import hooks and utilities from React and React Router for component state and navigation.
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import LoadingPopup from "../components/DaoRegistration/LoadingPopup";

// Import layout components for consistent page structure.
import Footer from "../components/Footer";
import NavBar from "../components/Navbar/Navbar";

// Import functions for backend communication and blockchain account management.
// import { RootState } from "../redux/store";
// import { useSelector } from "react-redux";
import { useProposalForm } from "../hooks/useProposalForm";
import { useProposalProgress } from "../hooks/useProposalProgress";
import { useProposalTransaction } from "../hooks/useProposalTransaction";
import { useReadContract } from "thirdweb/react";
import { FullDaoContract } from "../utils/handlers/Handlers";

/**
 * CreateProposal component renders a form that allows authenticated users
 * to create a new proposal. It handles form state, file uploads, and transaction
 * preparation/sending to the blockchain, as well as submission of proposal data
 * to the backend.
 *
 * Features include:
 * - Navigation using React Router.
 * - Blockchain interactions using Thirdweb's contract call utilities.
 * - File uploads to Cloudinary.
 * - Real-time progress tracking of form completion.
 *
 * @returns {JSX.Element} The rendered CreateProposal page.
 */
const CreateProposal: React.FC = () => {
  const navigate = useNavigate();
  // const userDaos = useSelector((state: RootState) => state.userDaos.daos);
  // const selectedDaoTxHash = localStorage.getItem("selectedDaoTxHash");
  // const selectedDao = userDaos.find(
  // (dao) => dao.daoTxHash === selectedDaoTxHash
  // );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const daoId = (localStorage.getItem("daoId") ?? "") as `0x${string}`;
  // Use the proposal form hook to manage form state and input handlers.
  const { proposalData, handleChange, handleFileChange } = useProposalForm();

  // Use the proposal transaction hook.
  const { handleCreateProposal } = useProposalTransaction(proposalData);

  // 🔁 Get DAO creator address from contract
  const { data: daoCreator, isPending } = useReadContract({
    contract: FullDaoContract,
    method:
      "function getDaoCreatorByDaoId(bytes32 _daoId) view returns (address)",
    params: [daoId],
  });

  // Calculate completed steps for the progress indicator.
  const completedSteps = useProposalProgress(proposalData, daoCreator ?? "");
  /**
   * Handles form submission for creating a proposal.
   *
   * Prevents the default form action, calls the proposal creation handler,
   * and if successful, sends the proposal data to the backend server. On success,
   * navigates the user to the newly created proposal's view page.
   *
   * @param event - The form submission event.
   */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!daoCreator || isPending) {
      alert("DAO creator address is not yet available.");
      return;
    }

    setIsSubmitting(true);

    const ProposaltxHash = await handleCreateProposal(daoCreator);
    console.log("This is the txhash", ProposaltxHash);

    setIsSubmitting(false);
    if (!ProposaltxHash) {
      alert("Proposal creation on blockchain failed!");
      return;
    }
    navigate(`/ViewProposal/${encodeURIComponent(proposalData.proposalTitle)}`);
  };

  const handleCancel = () => {
    setIsSubmitting(false);
    alert("Transaction canceled by user.");
  };

  return (
    <>
      <NavBar className={"CreateProposal"} />
      {isSubmitting && (
        <LoadingPopup
          message="Creating proposal on‑chain…"
          onCancel={handleCancel}
        />
      )}
      <main className="createProposal">
        <div className="proposalParag">
          <div className="top">
            <h1>Create a proposal</h1>
            <img
              src="/images/arrowback.png"
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

          {/* <div className="label three">
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
          </div> */}

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
