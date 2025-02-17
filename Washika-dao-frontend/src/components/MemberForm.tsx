// Define the structure of a Member object
interface Member {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  nationalIdNo: string;
  memberRole: string;
}

interface MemberFormProps {
  currentMember: Member;
  onMemberChange: (field: keyof Member, value: string) => void; // Function to handle changes to member fields
  onAddMember: () => void; // Function to add a new member and send  an invite to the member
}
/**
 * MemberForm is a React functional component that renders a form for managing
 * member information within a group. It allows users to view and edit details
 * of a current member, including their first name, last name, role, email,
 * contact number, and national ID number.
 *
 * @param {MemberFormProps} props - The properties passed to the component.
 * @param {Member} props.currentMember - The current member's information to be displayed and edited.
 * @param {(field: keyof Member, value: string) => void} props.onMemberChange - Callback function to handle changes to the member's fields.
 * @param {() => void} props.onAddMember - Callback function to add a new member.
 * @param {() => void} props.onInviteMember - Callback function to send an invite to new member.
 *
 *
 *
 * @returns {JSX.Element} A JSX element representing the member form UI.
 */
const MemberForm: React.FC<MemberFormProps> = ({
  currentMember, // Destructure props
  onMemberChange,
  onAddMember,
}) => {
  return (
    <div className="wanakikundi">
      <div className="left">
        <div>
          <h2>Member Information</h2>
          <p>As the Chairperson, Add your information along with the details of the Secretary and Treasurer</p>
        </div>
        <div className="two">
          <img src="images/Group.png" alt="profile logo" />
        </div>
      </div>
      <div className="right">
        <div className="top">Member Information</div>
        <div className="formDiv">
          <div className="div">
            <div className="first">
              <div className="input">
                <label>Add members Name</label>
                <div className="memberNames">
                  <input
                    type="text"
                    value={currentMember.firstName}
                    onChange={(e) =>
                      onMemberChange("firstName", e.target.value)
                    }
                    placeholder="first name"
                  />
                  <input
                    type="text"
                    value={currentMember.lastName}
                    onChange={(e) => onMemberChange("lastName", e.target.value)}
                    placeholder="last name"
                  />
                </div>
              </div>
              <div className="input">
                <label>Members Role</label>
                <select
                  value={currentMember.memberRole}
                  onChange={(e) => onMemberChange("memberRole", e.target.value)}
                  className="short"
                >
                  <option value="" disabled>
                    Role
                  </option>
                  <option value="Chairperson">Chairperson</option>
                  <option value="Treasurer">Treasurer</option>
                  <option value="Secretary">Secretary</option>
                </select>
              </div>
            </div>
            <div className="input">
              <label>Email</label>
              <input
                type="email"
                value={currentMember.email}
                onChange={(e) => onMemberChange("email", e.target.value)}
              />
            </div>
            <div className="input">
              <label>Contact</label>
              <input
                type="tel"
                value={currentMember.phoneNumber}
                onChange={(e) => onMemberChange("phoneNumber", e.target.value)}
              />
            </div>
            <div className="input">
              <label>Identification Number</label>
              <input
                type="text"
                value={currentMember.nationalIdNo}
                onChange={(e) => onMemberChange("nationalIdNo", e.target.value)}
              />
            </div>
            <div className="buttons">
              <button type="button" className="button-1" onClick={onAddMember}>
                Save member
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberForm;
