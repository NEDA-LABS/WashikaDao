const MemberTop: React.FC = () => {
  return (
    <>
      <section className="one">
        <div className="first">
          <h1>Welcome Member</h1>
          <p>
            We make it easy for you to find and access
            <br />
            all the important information about your financial groups
          </p>
        </div>
        <div className="center">
          <div className="secondly">
            <div className="header">
              <div className="left">
                <img src="/images/speed-up-line.png" alt="logo" />
                <h1>Credit Score</h1>
              </div>
              <div className="right">
                <img src="/images/Vector1.png" alt="" />
                <p>Apply</p>
              </div>
            </div>
            <div className="credit">
              <h2>
                Your <span>credit score </span>is <span>0</span>
              </h2>
              <p>Build your credit score by buying shares</p>
            </div>
            <div className="bars">
              {Array.from({ length: 36 }, (_, index) => (
                <div key={index}></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default MemberTop;
