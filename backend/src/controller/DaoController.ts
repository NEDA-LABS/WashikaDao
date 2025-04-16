import { Request, Response } from "express";
import { Dao } from "../entity/Dao";
import { MemberDetails } from "../entity/MemberDetails";
import AppDataSource from "../data-source";

export async function CreateDao(req: Request, res: Response) {
  // Extract DAO details from request body
  const {
    daoName,
    daoLocation,
    targetAudience,
    daoTitle,
    daoDescription,
    daoOverview,
    daoImageIpfsHash,
    daoRegDocs,
    daoMultiSigAddr,
    multiSigPhoneNo,
    kiwango, //Amount
    accountNo,
    nambaZaHisa,
    kiasiChaHisa,
    interestOnLoans,
    daoTxHash,
  } = req.body;

  // Validate required DAO fields
  if (
    !daoName ||
    !daoLocation ||
    !targetAudience ||
    !daoTitle ||
    !daoDescription ||
    !daoOverview ||
    !daoRegDocs ||
    !daoMultiSigAddr ||
    !kiwango ||
    !accountNo ||
    !nambaZaHisa ||
    !kiasiChaHisa ||
    !interestOnLoans ||
    !daoTxHash 
  ) {
    throw new Error("Missing required DAO details or invalid members list");
  }

  const daoRepository = AppDataSource.getRepository(Dao);
  //function to check whether dao exists or not
  const existingDao = await daoRepository.findOne({
    where: { daoMultiSigAddr },
  });

  if (existingDao) {
    throw new Error("DAO with this daoMultiSigAddr already exists.");
  }

  try {
    // Save DAO details to the database
    const dao = daoRepository.create({
      daoName,
      daoLocation,
      targetAudience,
      daoTitle,
      daoDescription,
      daoOverview,
      daoImageIpfsHash,
      daoRegDocs,
      daoMultiSigAddr,
      multiSigPhoneNo,
      kiwango,
      accountNo,
      nambaZaHisa,
      kiasiChaHisa,
      interestOnLoans,
      daoTxHash,
    });

    await daoRepository.save(dao);
    return res.status(201).json({ message: "DAO created successfully", dao });
  } catch (error) {
    console.error("Error creating DAO with members:", error);
    res.status(500).json({ error: error.message });
  }
}


export async function GetAllDaosInPlatform(req: Request, res: Response) {
  try {
    const daoRepository = AppDataSource.getRepository(Dao);
    // Fetch all DAOs
    const daoList = await daoRepository.find();
     res.status(200).json({ daoList });
  } catch (error) {
     res.status(500).json({ error: "Error retrieving DAO list" });
  }
}


export async function GetDaoDetailsByDaoTxHash(req: Request, res: Response) {
  const { daoTxHash } = req.query;

  if (!daoTxHash || typeof daoTxHash !== "string") {
    return res
      .status(400)
      .json({ message: "Missing or invalid daoTxHash query parameter!" });
  }

  try {
    const daoRepository = AppDataSource.getRepository(Dao);
    const daoDetails = await daoRepository.findOne({
      where: { daoTxHash: daoTxHash.toLowerCase().trim() },
    });

    if (!daoDetails) {
      return res.status(404).json({ error: "DAO not found!" });
    }

      return res.status(200).json({
        message: "DAO found with the details below",
        daoDetails: {
          daoId: daoDetails.daoId,
          daoName: daoDetails.daoName,
          daoLocation: daoDetails.daoLocation,
          targetAudience: daoDetails.targetAudience,
          daoTitle: daoDetails.daoTitle,
          daoDescription: daoDetails.daoDescription,
          daoOverview: daoDetails.daoOverview,
          daoImageIpfsHash: daoDetails.daoImageIpfsHash,
          daoRegDocs: daoDetails.daoRegDocs,
          daoMultiSigAddr: daoDetails.daoMultiSigAddr,
          multiSigPhoneNo: daoDetails.multiSigPhoneNo,
          kiwango: daoDetails.kiwango,
          accountNo: daoDetails.accountNo,
          nambaZaHisa: daoDetails.nambaZaHisa,
          kiasiChaHisa: daoDetails.kiasiChaHisa,
          interestOnLoans: daoDetails.interestOnLoans,
          daoTxHash: daoDetails.daoTxHash,
         // members: daoDetails.members,
          //chairpersonAddr,
        },
      });
  } catch (error) {
    console.error("Error finding DAO:", error);
    return res.status(500).json({ error: "Error finding DAO" });
  }
}


export async function UpdateDaoDetails(req: Request, res: Response) {
  const { daoMultiSigAddr } = req.params;
  if (!daoMultiSigAddr) {
    return res.status(400).json({ error: "Missing required url params" }); //return 400 status if required fields are missing
  }
  const {
    daoName,
    daoLocation,
    targetAudience,
    daoTitle,
    daoDescription,
    daoOverview,
    daoImageIpfsHash,
    daoRegDocs,
    kiwango,
    accountNo,
    nambaZaHisa,
    kiasiChaHisa,
    interestOnLoans,
  } = req.body;

  try {
    const daoRepository = AppDataSource.getRepository(Dao);
    let _daoDetails;
    async function doesDaoWithThisMsigExist(_daoTxHash: any): Promise<boolean> {
      const _doesMsigExist = await daoRepository.findOne({
        where: { daoTxHash: _daoTxHash },
      });
      if (_doesMsigExist) {
        _daoDetails = _doesMsigExist;
        return true;
      }
      return false;
    }
    const doesMsigExist: boolean = await doesDaoWithThisMsigExist(daoMultiSigAddr);
    if (doesMsigExist === false) {
      return res
        .status(404)
        .json({ message: "Dao With that Multisig has not been found" });
    }
    const daoDetails = _daoDetails;
    //daoID won't change when dao details are being updated  also not the way to add a multisig, a different method to add multisig will be implemented.
    daoDetails.daoName = daoName;
    daoDetails.daoLocation = daoLocation;
    daoDetails.targetAudience = targetAudience;
    daoDetails.daoTitle = daoTitle;
    daoDetails.daoDescription = daoDescription;
    daoDetails.daoOverview = daoOverview;
    daoDetails.daoImageIpfsHash = daoImageIpfsHash;
    daoDetails.kiwango = kiwango;
    daoDetails.accountNo = accountNo;
    daoDetails.nambaZaHisa = nambaZaHisa;
    daoDetails.kiasiChaHisa = kiasiChaHisa;
    daoDetails.interestOnLoans = interestOnLoans;
    await daoRepository.save(daoDetails);
    res
      .status(200)
      .json({ message: ` Updated to ${[daoDetails]} details updated` });
  } catch (error) {
    res.status(500).json({ error: "Error updating DAO" });
  }
}


export async function FundDao(req: Request, res: Response) {
  const { daoMultiSigAddr, fundAmount } = req.body;
  console.log(fundAmount);
  if (!daoMultiSigAddr) {
    return res.status(400).json({ error: "Missing required multisig of Dao" }); //return 400 status if required fields are missing  //TODO: this should be a validation middleware function  to prevent potential errors
  }

  try {
    //TODO: mechanisms to transfer funds goes here
    //check if fundAmount is a positive number
    if (fundAmount <= 0) {
      return res
        .status(406)
        .json({ error: "Request Unacceptable, Invalid fund amount" });
    }

    //Use thirdparty funding api & check response using webhook or callback.
    const daoRepository = AppDataSource.getRepository(Dao);
    //function to check whether dao exists or not and returns a boolean
    async function _doesDaoWithThisMsigExist(
      _daoMultiSig: any
    ): Promise<boolean> {
      const _doesMsigExist = await daoRepository.findOne({
        where: { daoMultiSigAddr: _daoMultiSig },
      });
      if (_doesMsigExist) {
        return true;
      }
      return false;
    }
    const doesMsigExist: boolean = await _doesDaoWithThisMsigExist(
      daoMultiSigAddr
    );
    if (doesMsigExist === false) {
      return res.status(404).json({ message: "DAO not found" });
    }
    res.status(202).json({ message: "Funding successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error funding DAO Due to an internal Server Error" });
  }
}

export async function GetAllDaoFunds(req: Request, res: Response) {
  console.log("I am yet to be implemented");
}
