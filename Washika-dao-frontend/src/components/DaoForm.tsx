interface Option {
  label: string;
  value: string;
  disabled?: boolean; // Allow disabled attribute
  selected?: boolean; // Allow selected attribute
}

interface DaoFormProps {
  className: string;
  title: string;
  description: string;
  fields: {
    label: string;
    type: string;
    name?: string;
    id?: string;
    options?: Option[];
    value?: string | number;
    onChange?: (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => void | Promise<void>;
    onClick?: () => void;
  }[];
}


// Functional component definition for DaoForm, using React.FC with the defined props interface.
const DaoForm: React.FC<DaoFormProps> = ({
  className,
  title,
  description,
  fields,
}) => {
  return (
    <div className={className}>
      {" "}
      {/* Main container with className for styling */}
      <div className="left">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <div className="formDiv">
        {fields.map(
          (
            field,
            index // Mapping through the fields array to create inputs
          ) => (
            <div key={index} className="keyDiv">
              <label>{field.label}</label>
              {field.type === "textarea" ? ( // Conditional rendering for textarea
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
              ) : // field.type === "button" ? (
              //   <div className="button-group">
              //     <button
              //       type="button"
              //       id={field.id}
              //       name={field.name}
              //       className="button-1"
              //       onClick={field.onClick}
              //     >
              //       Connect Wallet
              //     </button>
              //     <button
              //       type="button"
              //       id={`${field.id}-create`}
              //       name={`${field.name}-create`}
              //       className="button-2"
              //     >
              //       Create New Wallet
              //     </button>
              //   </div>
              // ) :
              field.type === "select" ? ( // Conditional rendering for select input
                <select
                  name={field.name}
                  id={field.id}
                  value={field.value}
                  onChange={field.onChange}
                >
                  {" "}
                  {/* Dropdown for options */}
                  {field.options?.map(
                    (
                      option,
                      idx // Mapping through options to create <option> elements
                    ) => (
                      <option key={idx} value={option.value} disabled={option.disabled} selected={option.selected}>
                        {" "}
                        {/* Unique key for each option */}
                        {option.label}
                      </option>
                    )
                  )}
                </select>
              ) : field.type === "file" ? (
                <input
                  type="file"
                  name={field.name}
                  className="file-input"
                  onChange={(e) => field.onChange && field.onChange(e)}
                />
              ) : (
                <input
                type={field.type}
                name={field.name}
                id={field.id}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DaoForm;