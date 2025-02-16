import { useEffect, useState } from "react";
import { uploadFileToCloudinary } from "../DaoRegistration/Cloudinary.tsx";
import { IBackendDaoCreation } from "../utils/Types.ts";
import { useDaoTransaction } from "./useDaoTransaction.ts";

export const useDaoForm = () => {
  const memberAddr = localStorage.getItem("address");
  const { daoTxHash } = useDaoTransaction();

  const [formData, setFormData] = useState<IBackendDaoCreation>({
    daoName: "",
    daoLocation: "",
    targetAudience: "",
    daoTitle: "",
    daoDescription: "",
    daoOverview: "",
    daoImageIpfsHash: "",
    daoRegDocs: "",
    daoMultiSigAddr: memberAddr || "",
    multiSigPhoneNo: "",
    kiwango: 0,
    accountNo: "",
    nambaZaHisa: 0,
    kiasiChaHisa: 0,
    interestOnLoans: 0,
    daoTxHash: daoTxHash || "",
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      daoTxHash: daoTxHash || "",
    }));
  }, [daoTxHash]);
  

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const fieldName = e.target.name;

    if (file) {
      const resourceType = fieldName === "daoImageIpfsHash" ? "image" : "raw";
      const fileUrl = await uploadFileToCloudinary(file, resourceType);
      if (fileUrl) {
        setFormData((prev) => ({ ...prev, [fieldName]: fileUrl }));
      }
    }
  };

  return { formData, setFormData, handleChange, handleFileChange };
};
