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
  fields: Field[];
}

interface Field {
  label: string;
  type: string;
  name?: string;
  id?: string;
  options?: Option[];
  value?: string | number;
  placeholder?: string;
  onChange?: (
    e: React.ChangeEvent<
      HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement
    >
  ) => void | Promise<void>;
  onClick?: () => void;
  group?: boolean; // Add this to indicate grouped fields
  fields?: Field[]; // Add this for nested fields
}

// Functional component definition for DaoForm, using React.FC with the defined props interface.
/**
 * A React functional component that renders a dynamic form based on the provided fields.
 *
 * @param {DaoFormProps} props - The properties for the DaoForm component.
 * @param {string} props.className - The CSS class name for styling the main container.
 * @param {string} props.title - The title displayed at the top of the form.
 * @param {string} props.description - A description displayed below the title.
 * @param {Field[]} props.fields - An array of field objects defining the form inputs.
 *
 * @returns {JSX.Element} A JSX element representing the form.
 */
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
          ) =>
            field.group ? (
              <div key={index} className="groupDiv">
                {field.fields?.map((subField: Field, subIndex: number) => (
                  <div key={subIndex} className="keyDiv">
                    {subField.type === "file" ? (
                      <div>
                        <label>{subField.label}</label>
                        <input
                          type="file"
                          name={subField.name}
                          className={`file-input file-input-${subIndex}`}
                          onChange={(e) =>
                            subField.onChange && subField.onChange(e)
                          }
                        />
                      </div>
                    ) : (
                      <div>
                        <label>{subField.label}</label>
                        <input
                          type={subField.type}
                          name={subField.name}
                          value={subField.value}
                          placeholder={subField.placeholder}
                          onChange={subField.onChange}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
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
                ) : field.type === "select" ? ( // Conditional rendering for select input
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
                        <option
                          key={idx}
                          value={option.value}
                          disabled={option.disabled}
                          selected={option.selected}
                        >
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
            )
        )}
      </div>
    </div>
  );
};

export default DaoForm;
