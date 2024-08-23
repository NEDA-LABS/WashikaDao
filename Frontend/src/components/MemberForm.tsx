const MemberForm: React.FC = () => {
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
              <input type="text"/>
            </div>
            <div className="input">
              <label>Nafasi yake</label>
              <input type="number"  className="short"/>
            </div>
          </div>
          <div className="input">
            <label>Contact</label>
            <input type="number" />
          </div>
          <div className="input">
            <label>No. ya kitambulisho</label>
            <input type="number" />
          </div>
          <div className="buttons">
            <button type="button" className="button-1">Ongeza mwingine</button>
            <button type="button" className="button-2">Create new wallet</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberForm;
