// Define the structure of a Member object
interface Member {
  name: string;
  phoneNumber: string;
  nationalIdNo: string;
  memberRole: string;
}

interface MemberFormProps {
  currentMember: Member;
  onMemberChange: (field: keyof Member, value: string) => void; //Function to handle changes to member fields
  onAddMember: () => void; //Function to add a new member
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
          <img src="images/Group.png" alt="profile logo" width={193} />
        </div>
      </div>
      <div className="right">
        <div className="top">Taarifa za wanachama</div>
        <div className="formDiv">
          <div className="first">
            <div className="input">
              <label>Jina la mwanachama</label>
              <input
                type="text"
                value={currentMember.name}
                onChange={(e) => onMemberChange("name", e.target.value)}
              />
            </div>
            <div className="input">
              <label>Nafasi yake</label>
              <input
                type="text"
                value={currentMember.memberRole}
                onChange={(e) => onMemberChange("memberRole", e.target.value)}
                className="short"
              />
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
              Create new wallet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberForm;
