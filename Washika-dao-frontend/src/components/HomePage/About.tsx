import GroupInfo from "../GroupInfo.js";

const About: React.FC = () => {
  return (
    <>
      <p className="parag-container">
        We enable Saving Groups to manage and
        <br /> grow their savings with Ease and
        <br />
        transparency
      </p>
      
      <section className="main-container">
        <div className="boxes">
          <div className="box one">
            <div className="box-left">
              <div>
                <h1>Safe and Modern</h1>
                <p>
                  Securely manage your DAO's activities. With real time
                  <span> Account balance, Share balance</span> and easy apply
                  for <span>loans</span>.
                </p>
              </div>
            </div>
            <div className="box-right">
              <div>
                <img src="images/LOGO SYMBLO.png" alt="logo" width="63" />
                <a href="Homepage.html">
                  <img src="images/wordlogo.png" alt="logo" width="253" />
                </a>
              </div>
            </div>
          </div>

          <div className="box two">
            <div className="box-left two">
              <div>
                <h1>Education HUB</h1>
                <p>
                  With a dedicated portal for education,
                  <span> Learn about the digital economy</span>. Learn how you
                  can grow your income with technology
                </p>
              </div>
            </div>
            <div className="box-right"></div>
          </div>

          <div className="half-box box-left">
            <div>
              <h1>Apply for Loans with Ease</h1>
              <p>
                Grow your income with ease.
                <span>
                  {" "}
                  Get access to loans with trust collateral and low interest
                </span>
                . Building a trust economy that is community first
              </p>
            </div>
          </div>
        </div>

        <GroupInfo />
      </section>
    </>
  );
};

export default About;
