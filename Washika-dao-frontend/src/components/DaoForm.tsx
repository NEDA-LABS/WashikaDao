interface DaoFormProps {
  className: string;
  title: string;
  description: string;
  fields: {
    label: string;
    type: string;
    name?: string;
    id?: string;
    options?: { label: string; value: string }[];
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onClick?: () => void;
  }[];
}

const DaoForm: React.FC<DaoFormProps> = ({
  className,
  title,
  description,
  fields,
}) => {
  return (
    <div className={className}>
      <div className="left">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <div className="formDiv">
        {fields.map((field, index) => (
          <div key={index} className="keyDiv">
            <label
              className={
                field.label ===
                "Unganisha multi-sig wallet/acc for your kikundi" || field.label === "Connect wallet/acc"
                  ? "connect-wallet-label"
                  : field.label ===
                    "Andika akaunti namba ambayo itapokea fedha za kikundi" || field.label === "Fill in your Digital wallet ID"
                  ? "account-number-label"
                  : ""
              }
            >
              {field.label}
            </label>
            {field.type === "textarea" ? (
              <textarea
                name={field.name}
                id={field.id}
                value={field.value}
                onChange={field.onChange}
                className={
                  field.label === "Maelezo mafupi/utangulizi"
                    ? "short-textarea"
                    : "long-textarea"
                }
              ></textarea>
            ) : field.type === "button" ? (
              <div className="button-group">
                <button
                  type="button"
                  id={field.id}
                  name={field.name}
                  className="button-1"
                  onClick={field.onClick}
                >
                  Connect Wallet
                </button>
                <button
                  type="button"
                  id={`${field.id}-create`}
                  name={`${field.name}-create`}
                  className="button-2"
                >
                  Create New Wallet
                </button>
              </div>
            ) : field.type === "select" ? (
              <select name={field.name} id={field.id}>
                {field.options?.map((option, idx) => (
                  <option key={idx} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                name={field.name}
                id={field.id}
                value={field.value}
                onChange={field.onChange}
                placeholder={
                  field.label ===
                  "Andika akaunti namba ambayo itapokea fedha za kikundi" || field.label === "Fill in your Digital wallet ID"
                    ? "0xea987516dCE6A978473Ca5aFbaA7A392d40e56f8"
                    : ""
                }
                className={field.type === "file" ? "file-input" : ""}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DaoForm;
