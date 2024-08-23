import Footer from "../components/Footer";
import NavBar from "../components/NavBar";

const Owner: React.FC = () => {
  return (
    <>
      <NavBar className={""} />
      <main>
        <section>
          <div>
            <h1>Hi, Shaila</h1>
            <p>Welcome to your one-stop platform for your DAO operations</p>
          </div>

          <div>
            <button>Create a Proposal</button>
            <button>Vote on a Proposal</button>
          </div>
        </section>

        <section>
          <h2>My Proposals</h2>
          <div>
            <div>
              <div>
                <h1>Proposal for Buying new spare part of machinery</h1>
                <div>Rejected</div>
              </div>
              <div>
                <p>
                  We are Nipe Fagio, an environmental non-profit organization
                  committed to cleaning and preserving our beaches. Our goal is
                  to collect and remove at least 10 tons of plastic waste
                  through community clean-up events and outreach programs.
                </p>
              </div>
              <div>
                <div>
                  <button>Vote on Proposal</button>
                  <button>View linked resources</button>
                </div>

                <div>
                  <p>Amount Requested</p>
                  <p>
                    3,000,000<span>Tsh</span>
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div>
                <h1>Proposal for Beach clean up - msasani to Mbezi</h1>
                <div>In progress</div>
              </div>
              <div>
                <p>
                  We are Nipe Fagio, an environmental non-profit organization
                  committed to cleaning and preserving our beaches. Our goal is
                  to collect and remove at least 10 tons of plastic waste
                  through community clean-up events and outreach programs.
                </p>
              </div>
              <div>
                <div>
                  <button>Vote on Proposal</button>
                  <button>View linked resources</button>
                </div>

                <div>
                  <p>Amount Requested</p>
                  <p>
                    3,000,000<span>Tsh</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section>
          <div>
            <h1>Verified projects</h1>
            <p>
              Trust that your funds will take an impact with our verification
              system
            </p>
          </div>

          <div>
            <h1>Funder Rewards</h1>
            <p>Get rewarded to verify public goods and stacking DAOs</p>
          </div>
          <div>
            <h1>Easy Onboarding</h1>
            <p>
              Are you new to Blockchain? It's easy to get started. We will guide
              you
            </p>
          </div>
        </section>
      </main>
      <Footer className={""} />
    </>
  );
};

export default Owner;
