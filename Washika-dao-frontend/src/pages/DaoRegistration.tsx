import Footer from "../components/Footer";
import DaoForm from "../components/DaoForm";
import NavBar from "../components/NavBar";
import MemberForm from "../components/MemberForm";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import { DaoCreationFormInputs, daoCreationTxResult } from "../utils/Types";
import { prepareContractCall } from "thirdweb";
import { FullDaoContract } from "../utils/handlers/Handlers";


const DaoRegistration: React.FC =  () => {
        const currActiveAcc = useActiveAccount(); 
        const { mutate: sendTx, data: transactionResult } = useSendTransaction();

        //Managing state of the input fields 
        const [_daoName, setDaoName] = useState("daoName");
        const [_location, setLocation] = useState("location");
        const [_targetAudience, setTargetAudience] = useState("targetAudience");
        const [_daoTitle, setDaoTitle] = useState("daoTitle");
        const [_daoDescription, setDaoDescription] = useState("daoDescription");
        const [_daoOverview, setDaoOverview] = useState("daoOverview");
        const [_daoImageUrlHash, setDaoImageUrlHash] = useState("daoImageUrlHash");
        const [_multiSigPhoneNo, setMultiSigPhoneNo] = useState<BigInt>();
 
            //Function to handle the creation of the DAO
            async function handleCreateDao() {
              try {
                  if (!currActiveAcc) {
                    console.error("Fatal Error reading account");
                      return;
                  }
                    const createDaoTx = prepareContractCall({
                          contract: FullDaoContract,
                          method: "createDao",
                          params: [
                          _daoName,
                          _location,
                          _targetAudience,
                          _daoTitle,
                          _daoDescription,
                          _daoOverview,
                          _daoImageUrlHash,
                          currActiveAcc.address, //multisig address 
                          //@ts-ignore
                          _multiSigPhoneNo, // Add null coalescing operator to handle undefined
                          ],
                    });
                      console.log("Transaction ready", createDaoTx);
                      console.log("Initializing sending transaction to the blockchain"); 
                      //@ts-ignore
                      await sendTx(createDaoTx as never);
              } catch (error: unknown) {
                if (error instanceof Error && error.message.includes("AA21")) {
                  prompt("Gas sponsorship issue, please top up your account or request for gas sponsorship"); 
                } else {
                  console.error("Error creating dao", error);
                }
                  console.log(`Current transaction result ${transactionResult}`)
                }
            }
  function handleDaoCreation(e: any): void {
    e.preventDefault();
    handleCreateDao();
  };


  return (

    <div className="daoRegistration">
      <NavBar className={""} />
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
                <form onSubmit={handleDaoCreation}>
                  <label className="idk">Name of Dao</label>
                  <input
                    type="text"
                    value={_daoName}
                    placeholder="Name of Dao"
                    onChange={(e) => setDaoName(e.target.value)}/> 
                  <label className="idk">Location</label>
                  <input
                    type="text"
                    value={_location}
                    placeholder="Location"
                    onChange={(e) => setLocation(e.target.value)}/>
                  <label className="idk">Target Audience</label>
                  <input
                    type="text"
                    value={_targetAudience}
                    placeholder="Target Audience"
                    onChange={(e) => setTargetAudience(e.target.value)}/>
                  <label className="idk">Dao Title</label>
                  <input
                    type="text"
                    value={_daoTitle}
                    placeholder="Dao Title"
                    onChange={(e) => setDaoTitle(e.target.value)}/>
                  <label className="idk">Dao Description</label>
                  <input
                    type="text"
                    value={_daoDescription}
                    placeholder="Dao Description"
                    onChange={(e) => setDaoDescription(e.target.value)}/>
                  <label className="idk">Dao Overview</label>
                  <input
                    type="text"
                    value={_daoOverview}
                    placeholder="Dao Overview"
                    onChange={(e) => setDaoOverview(e.target.value)}/>
                  <label className="idk">Dao Image URL Hash</label>
                  <input
                    type="text"
                    value={_daoImageUrlHash}
                    placeholder="Dao Image URL Hash"
                    onChange={(e) => setDaoImageUrlHash(e.target.value)}/>
                  <label className="idk">Multi-Sig Phone Number</label>
                  <input
                    type="text"
                    value={_multiSigPhoneNo}
                    placeholder="Multi-Sig Phone Number"
                    onChange={(e) => setMultiSigPhoneNo(BigInt((e.target.value)))}/>

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
