var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { daoContract } from "./config.ts";
export const isDaoMember = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ destructuring values from incoming form data
    const { _memberToCheck, _daoMultisig } = req.body;
    if (!_memberToCheck || !_daoMultisig) {
        return res.status(400).json({ error: 'missing required fields' });
    }
    try {
        const isMember = yield daoContract.write.isDaoMember([
            _memberToCheck,
            _daoMultisig
        ]);
        //@ts-ignore
        if (isMember === 'true' || isMember === 'false') {
            res.status(200).json(isMember);
            console.log(isMember);
        }
    }
    catch (error) {
        res.status(500).json({ error: 'request erroed' });
    }
});
