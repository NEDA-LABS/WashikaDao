var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { wagmiAbi } from "../utils/contractAbi/abi.js";
import { daoContract, publicClient } from "./config.ts";
import { MemberDetails } from "../models/Members.ts";
import { AppDataSource } from "../app.ts";
const memberDetailsRepository = AppDataSource.getRepository(MemberDetails);
/*
 *Client form data:  { Name, PhoneNo(tobeusedasaddress), IdNo, role}
 *Smart Contract Needs: {email/name, memberAddr(mapped2phoneno),_callerAddr(whostryingtocall),_daoToJoinMultisig)
 * checks can be performed to ensure whoever is calling this function is the _daoToJoinMultisig so the contract doesn't have to deal with unncesary computation
 * Also, some details can be pre-sumptuously deduced from the client
 **/
export const addMember = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //destructuring  all necessary data from requeest body
    const { _phoneNo, _nationalIdNo, _email, _memberAddr, _callerAddr, _daoToJoinMultisig, _role } = req.body;
    if (!_email || !_memberAddr || !_callerAddr || !_daoToJoinMultisig || !_role) {
        return res.status(400).json({ error: 'Missing required' });
    }
    try {
        yield daoContract.write.addMember([
            _email,
            _memberAddr,
            _callerAddr,
            _daoToJoinMultisig,
            _role
        ]);
        /**Saving the details we want to the db **/
        const mD = new MemberDetails();
        mD.memberAddr = _memberAddr;
        mD.phoneNumber = _phoneNo;
        mD.nationalIdNo = _nationalIdNo;
        mD.memberRole = _role;
        mD.memberAddr = _memberAddr;
        mD.daoMultiSig = _daoToJoinMultisig;
        yield memberDetailsRepository.save(mD);
        /**Back to the Blockchain Baby**/
        //consume an event for the return message
        const evLogs = yield publicClient.getContractEvents({
            address: "0x8EC4eE1A1aEccE5Df1a630ea50Aa9716549cE9Ff",
            abi: wagmiAbi,
            eventName: 'MemberAdded'
        });
        console.log(evLogs);
        res.status(201).json(evLogs);
    }
    catch (error) {
        res.status(500).json({ error: 'Error adding member' });
    }
});
export const getMemberDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _memberAddr } = req.body; //possibly passed in params but lets see how this goes
    try {
        const memberDetails = yield memberDetailsRepository.findOneBy(_memberAddr);
        if (memberDetails) {
            res.json(memberDetails);
        }
        else {
            res.status(404).json({ message: 'Member not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Errored request' });
    }
});