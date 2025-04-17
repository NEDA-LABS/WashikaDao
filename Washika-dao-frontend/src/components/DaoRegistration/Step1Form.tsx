import React from "react";
import DaoForm, { Field } from "../DaoForm";
import { IBackendDaoCreation } from "../../utils/Types";

export interface Step1FormProps {
  formData: Pick<
    IBackendDaoCreation,
    "daoName" | "daoLocation" | "targetAudience" | "daoDescription"
  >;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  onNextStep: () => void;
}

const Step1Form: React.FC<Step1FormProps> = ({
  formData,
  handleChange,
  onNextStep,
}) => {
  const fields: Field[] = [
    {
      label: "Name of your Group",
      type: "text",
      name: "daoName",
      value: formData.daoName,
      onChange: handleChange,
    },
    {
      label: "Location",
      type: "text",
      name: "daoLocation",
      value: formData.daoLocation,
      onChange: handleChange,
    },
    {
      label: "Target Audience",
      type: "text",
      name: "targetAudience",
      value: formData.targetAudience,
      onChange: handleChange,
    },
    {
      label: "What is your Savings Group about?",
      type: "textarea",
      name: "daoDescription",
      value: formData.daoDescription,
      onChange: handleChange,
    },
  ];

  return (
    <div className="step step1">
      <DaoForm
        className="form one"
        title="Fill this form to your DAO"
        description="Tell us about your group"
        fields={fields}
      />
      <div className="form-progress">
        <button type="button" onClick={onNextStep}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Step1Form;
