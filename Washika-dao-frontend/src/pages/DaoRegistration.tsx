//import Footer from "../components/Footer";
//import DaoForm from "../components/DaoForm";
import NavBar from "../components/NavBar.tsx";
//import MemberForm from "../components/MemberForm";
//import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
//import { DaoCreationFormInputs, daoCreationTxResult } from "../utils/Types";
import { prepareContractCall } from "thirdweb";
import { FullDaoContract } from "../utils/handlers/Handlers.ts";


const DaoRegistration: React.FC =  () => {
        const currActiveAcc = useActiveAccount();
        const { mutate: sendTx, data: transactionResult } = useSendTransaction();

        //a better way to do forms?
        const [formData, setFormData] = useState({
          _daoName: "",
          _location: "",
          _targetAudience: "",
          _daoTitle: "",
          _daoDescription: "",
          _daoOverview: "",
          _daoImageUrlHash: "",
          _multiSigPhoneNo: "",//store as string initially
        });

        const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const { name, value } = event.target;
            setFormData(prevFormData => ({
                ...prevFormData, [name]: value,
            }));
        };

            //Grooming the Dao transaction
            const prepareCreateDaoTx = (_multiSigPhoneNo: BigInt): Boolean | any => {
              if (currActiveAcc === undefined) {
                console.error("undefined value for current active account is not allowed")
                return false; //Failed to prepare transaction since account isn't pluggged in
              }
              try {
                console.log("Preparing dao Creation transaction")
               const _createDaotx = prepareContractCall({
                  contract: FullDaoContract,
                          method: "createDao",
                          params: [
                          formData._daoName,
                          formData._location,
                          formData._targetAudience,
                          formData._daoTitle,
                          formData._daoDescription,
                          formData._daoOverview,
                          formData._daoImageUrlHash,
                          currActiveAcc.address, //multisig address
                          BigInt(_multiSigPhoneNo?.toString() ?? "0"), // Convert to BigInt and handle undefined
                          ],
                })
                console.log("Dao Creation transaction prepared", _createDaotx);
                return _createDaotx;
              } catch(error) {
                console.error("Error preparing transaction:", error);
                return false; //error caused the preparation to fail
              }
              return true; //else everything looks good and should return true
            }

            //function to actually now send the transaction
            const sendCreateDaoTx = async(_createDaotx: any) => {
                  if(_createDaotx === undefined) {
                    console.warn("undefined transaction");
                    return;
                  }
                  try {
                   const createDaoTxReceipt =  await sendTx(_createDaotx);
                    console.log("It would occur that the transaction has been sent successfully", createDaoTxReceipt);
                   // console.log("Transaction Hash:", createDaoTxReceipt?.transactionHash)
                  } catch (error) {
                    if (error instanceof Error && error.message.includes("AA21")) {
                      prompt("Gas sponsorship issue, please top up your account or request for gas sponsorship");
                    } else {
                      console.error("Error creating dao", error);
                    }
                      console.log(`Current transaction result ${transactionResult}`)
                    }
                  }

            const handleCreateDao = async (event: React.FormEvent<HTMLFormElement>) => {
                event.preventDefault();
                try {
                   //Converting multisigPhoneNo to BigInt with default value
                const multisigPhoneNoBigInt = BigInt(formData._multiSigPhoneNo || "0");
                console.log("Phone number to bind to multisig for dao", multisigPhoneNoBigInt);
                console.log("--------------Now Calling prepareCreateDaoTx--------")
                const finalTx = await prepareCreateDaoTx(multisigPhoneNoBigInt);
                if (finalTx) {
                  await sendCreateDaoTx(finalTx);
                  console.log("Tx was a success");
                } else {
                  console.log("looks like tx failed")
                }
                } catch (error: unknown) {
                  if (error instanceof Error && error.message.includes("AA21")) {
                      prompt("Gas sponsorship issue, please top up your account or request for gas sponsorship");
                  } else {
                      console.error("Error creating dao", error);
                  }
              };
            }


  return (

    <div className="daoRegistration">
      <NavBar className={""} />
      {memberAddr && role ? ( // Only show form if user role is "owner"
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
                <form onSubmit={handleCreateDao}>
                  <label className="idk">Name of Dao</label>
                  <input
                    type="text"
                    name="_daoName"
                    value={formData._daoName}
                    placeholder="Name of Dao"
                    onChange={handleInputChange}
                    />
                  <label className="idk">Location</label>
                  <input
                    type="text"
                    name="_location"
                    value={formData._location}
                    placeholder="Location"
                    onChange={handleInputChange}
                    />
                  <label className="idk">Target Audience</label>
                  <input
                    type="text"
                    name="_targetAudience"
                    value={formData._targetAudience}
                    placeholder="Target Audience"
                    onChange={handleInputChange}
                    />
                  <label className="idk">Dao Title</label>
                  <input
                    type="text"
                    name="_daoTitle"
                    value={formData._daoTitle}
                    placeholder="Dao Title"
                    onChange={handleInputChange}
                    />
                  <label className="idk">Dao Description</label>
                  <input
                    type="text"
                    name="_daoDescription"
                    value={formData._daoDescription}
                    placeholder="Dao Description"
                    onChange={handleInputChange}
                    />
                  <label className="idk">Dao Overview</label>
                  <input
                    type="text"
                    name="_daoOverview"
                    value={formData._daoOverview}
                    placeholder="Dao Overview"
                    onChange={handleInputChange}
                    />
                  <label className="idk">Dao Image URL Hash</label>
                  <input
                    type="text"
                    name="_daoImageUrlHash"
                    value={formData._daoImageUrlHash}
                    placeholder="Dao Image URL Hash"
                    onChange={handleInputChange}
                    />
                  <label className="idk">Multi-Sig Phone Number</label>
                  <input
                    type="text"
                    name="_multiSigPhoneNo"
                    value={formData._multiSigPhoneNo}
                    placeholder="Multi-Sig Phone Number"
                    onChange={handleInputChange}
                    />

              <center>
                <button className="createDao" type="submit">
                  Create DAO
                </button>
              </center>
            </form>
    </div>
  );
}

export default DaoRegistration;
