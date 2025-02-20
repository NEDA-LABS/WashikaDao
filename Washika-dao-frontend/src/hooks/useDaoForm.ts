import { useState, useEffect } from "react";
import { uploadFileToCloudinary } from "../DaoRegistration/Cloudinary.tsx";
import { IBackendDaoCreation } from "../utils/Types.ts";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store.ts";

export const useDaoForm = (chairpersonPhone: string = "") => {
  const memberAddr = useSelector((state: RootState) => state.auth.address);
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
    multiSigPhoneNo: chairpersonPhone, // Set initial value from parameter
    kiwango: 0,
    accountNo: "",
    nambaZaHisa: 0,
    kiasiChaHisa: 0,
    interestOnLoans: 0,
    daoTxHash: "",
  });

  // Update multiSigPhoneNo if chairpersonPhone changes.
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      multiSigPhoneNo: chairpersonPhone,
    }));
  }, [chairpersonPhone]);

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
