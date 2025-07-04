import React from "react";
import DaoForm, { Field } from "../DaoForm.js";
import { IBackendDaoCreation } from "../../utils/Types.js";

export interface Step2FormProps {
  formData: IBackendDaoCreation;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const Step2Form: React.FC<Step2FormProps> = ({
  formData,
  handleChange,
  handleFileChange,
  onSubmit,
  isSubmitting,
}) => {
  const fields: Field[] = [
    {
      label: "Header Bio",
      type: "text",
      name: "daoTitle",
      value: formData.daoTitle,
      onChange: handleChange,
    },
    {
      label: "Additional information if any and Group By‑laws",
      type: "textarea",
      name: "daoOverview",
      value: formData.daoOverview,
      onChange: handleChange,
    },
    {
      label: "Bank account number",
      type: "text",
      name: "accountNo",
      value: formData.accountNo,
      onChange: handleChange,
    },
    {
      group: true,
      fields: [
        {
          label: "Number of SHARES",
          type: "number",
          name: "nambaZaHisa",
          value: formData.nambaZaHisa || "",
          onChange: handleChange,
        },
        {
          label: "Amount per SHARE",
          type: "number",
          name: "kiasiChaHisa",
          value: formData.kiasiChaHisa || "",
          onChange: handleChange,
        },
        {
          label: "Loan Interest",
          type: "number",
          name: "interestOnLoans",
          value: formData.interestOnLoans || "",
          placeholder: "%",
          onChange: handleChange,
        },
      ],
      label: "",
      type: "",
    },
    {
      label: "",
      type: "",
      group: true,
      fields: [
        {
          label: "Profile Image",
          type: "file",
          name: "daoImageIpfsHash",
          onChange: (e) =>
            handleFileChange(e as React.ChangeEvent<HTMLInputElement>),
        },
        {
          label: "Upload Registration Documents",
          type: "file",
          name: "daoRegDocs",
          onChange: (e) =>
            handleFileChange(e as React.ChangeEvent<HTMLInputElement>),
        },
      ],
    },
  ];

  return (
    <div className="step step2">
      <DaoForm
        className="form two"
        title="About the group"
        description="Group overview and its objective"
        fields={fields}
      />
      <center>
        <button
          disabled={isSubmitting}
          className={`createDao ${isSubmitting ? "loading" : ""}`}
          onClick={onSubmit}
        >
          Save On-Chain
        </button>
      </center>
    </div>
  );
};

export default Step2Form;
