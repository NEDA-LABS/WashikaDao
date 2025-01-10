export type DaoCreationFormInputs = {
    _daoName: string;
    _location: string;
    _targetAudience: string;
    _daoTitle: string; 
    _daoDescription: string; 
    _daoOverview: string; 
    _daoImageUrlHash: string; 
    _multiSigPhoneNo: number;
   }

   export interface FormData {
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
  
  

export type FormInputsData = {
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

export interface Member {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    nationalIdNo: string;
    memberRole: string;
  }

export type daoCreationTxResult = {
  txHash: string;
}