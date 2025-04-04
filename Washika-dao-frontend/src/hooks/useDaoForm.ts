import { useState } from "react";
import { useCloudinaryUpload } from "./useCloudinaryUpload.ts";
import { IBackendDaoCreation } from "../utils/Types.ts";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store.ts";

export const useDaoForm = () => {
  const memberAddr = useSelector((state: RootState) => state.auth.address);
  const { uploadFileToCloudinary } = useCloudinaryUpload();
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
    daoTxHash: "",
  });

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
      // Set resource type to "image" if the field name indicates an image; otherwise "raw".
      const resourceType = fieldName === "daoImageIpfsHash" ? "image" : "raw";
      const fileUrl = await uploadFileToCloudinary(file, resourceType);
      if (fileUrl) {
        setFormData((prev) => ({ ...prev, [fieldName]: fileUrl }));
      }
    }
  };

  return { formData, setFormData, handleChange, handleFileChange };
};
