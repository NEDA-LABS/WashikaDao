// Define the structure of a Member object
interface Member {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  nationalIdNo: string;
  memberRole: string;
}

interface MemberFormProps {
  currentMember: Member;
  onMemberChange: (field: keyof Member, value: string) => void; // Function to handle changes to member fields
  onAddMember: () => void; // Function to add a new member
}

const MemberForm: React.FC<MemberFormProps> = ({
  currentMember, // Destructure props
  onMemberChange,
  onAddMember,
}) => {
  return (
    <div className="wanakikundi">
      <div className="left">
        <div>
          <h2>Wanakikundi chako</h2>
          <p>Taarifa za wanachama kwenye kikundi</p>
        </div>
        <div className="two">
          <img src="images/Group.png" alt="profile logo" />
        </div>
      </div>
      <div className="right">
        <div className="top">Taarifa za wanachama</div>
        <div className="formDiv">
          <div className="div">
             <div className="first">
            <div className="input">
              <label>Jina la mwanachama</label>
              <div className="memberNames">
                <input
                  type="text"
                  value={currentMember.firstName}
                  onChange={(e) => onMemberChange("firstName", e.target.value)}
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
              <label>Nafasi yake</label>
              <select
                value={currentMember.memberRole}
                onChange={(e) => onMemberChange("memberRole", e.target.value)}
                className="short"
              >
                <option value="" disabled>Role</option>
                <option value="Owner">Owner</option>
                <option value="Funder">Funder</option>
                <option value="Member">Member</option>
              </select>
            </div>
          </div>
          <div className="input">
            <label>Contact</label>
            <input
              type="number"
              value={currentMember.phoneNumber}
              onChange={(e) => onMemberChange("phoneNumber", e.target.value)}
            />
          </div>
          <div className="input">
            <label>No. ya kitambulisho</label>
            <input
              type="number"
              value={currentMember.nationalIdNo}
              onChange={(e) => onMemberChange("nationalIdNo", e.target.value)}
            />
          </div>
          <div className="buttons">
            <button type="button" className="button-1" onClick={onAddMember}>
              Ongeza mwingine
            </button>
            <button type="button" className="button-2">
              Mkaribishe
            </button>
          </div>
          </div>
         
        </div>
      </div>
    </div>
  );
};

export default MemberForm;
