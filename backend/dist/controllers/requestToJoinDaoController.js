var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { daoContract, publicClient } from "./config.ts";
import { wagmiAbi } from "../utils/contractAbi/abi.ts";
export const requestToJoinDao = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ destructuring values from incoming form data
    const { _multiSigAddr, _requester, _role } = req.body;
    if (!_multiSigAddr || !_requester || !_role) {
        return res.status(400).json({ error: 'Missing required' });
    }
    try {
        yield daoContract.write.requestToJoinDao([
            _multiSigAddr,
            _requester,
            _role
        ]);
        //consume event logs for the return message
        const evLogs = yield publicClient.getContractEvents({
            address: "0x8EC4eE1A1aEccE5Df1a630ea50Aa9716549cE9Ff",
            abi: wagmiAbi,
            eventName: 'requestedJoinDao'
        });
        console.log(evLogs);
        res.status(201).json(evLogs);
    }
    catch (error) {
        res.status(500).json({ error: 'Error sending request' });
    }
});
