interface DaoFormProps {
  className: string;
  title: string;
  description: string;
  fields: { label: string; type: string; name?: string; id?: string }[];
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
                "Unganisha multi-sig wallet/acc for your kikundi"
                  ? "connect-wallet-label"
                  : field.label ===
                    "Andika akaunti namba ambayo itapokea fedha za kikundi"
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
                className={
                  field.label === "Maelezo mafupi/utangulizi"
                    ? "short-textarea"
                    : "long-textarea"
                }
              ></textarea>
            ) : field.type === "button" ? (
              <div className="button-group">
                <button type="button" id={field.id} name={field.name} className="button-1">
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
            ) : (
              <input
                type={field.type}
                name={field.name}
                id={field.id}
                placeholder={field.label === "Andika akaunti namba ambayo itapokea fedha za kikundi" ? "0xea987516dCE6A978473Ca5aFbaA7A392d40e56f8" : ""}
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
