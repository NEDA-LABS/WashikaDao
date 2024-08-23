import Footer from "../components/Footer";
import NavBar from "../components/NavBar";

const JoinPlatform: React.FC = () => {
  return (
    <>
      <NavBar className={""} />
      <main>
        <div>
          <h1>Create, manage and fund community impact projects</h1>
          <p>Welcome to a one-stop platform for your DAO operations</p>
        </div>

        <div>
          <div>1</div>
          <div>2</div>
          <div>3</div>
          <div>4</div>
          <div>5</div>
        </div>

        <div>
          <div>
            <h2>Tell us About yourself</h2>
            <p>Create a free account</p>
          </div>
          <form>
            <div>
              <label>First Name</label>
              <input type="text" />
            </div>
            <div>
              <label>Last Name</label>
              <input type="text" />
            </div>
            <div>
              <label>Email</label>
              <input type="email" />
            </div>
            <div>
              <label>Role</label>
              <select name="" id="">
                <option value="">Role</option>
                <option value="">Role</option>
                <option value="">Role</option>
              </select>
            </div>
            <div>
              <label>Password</label>
              <input type="password" />
            </div>
            <div>
              <label>Confirm Password*</label>
              <input type="password" />
            </div>
          </form>
        </div>

        <div>
          <h1>Digital Wallet</h1>
          <p>Connect and fund impact DAOs and community saving groups</p>
        </div>

        <form>
          <div>
            <label>Connect wallet/acc</label>
            <div>
              <button>Connect wallet</button>
              <button>Create new wallet</button>
            </div>
          </div>
          <div>
            <label>Fill in your wallet ID</label>
            <input type="text" />
          </div>
        </form>

        <div>
          <button>Create an Account</button>
          <button>Join a DAO</button>
        </div>

        <div>
          <div>
            <h2>Find and join your DAO with ease</h2>
            <p>Find and connect with your DAO and start participating</p>
            <div>icon</div>
          </div>
          <div>
            <select name="" id="">
              Select your DAO
              <option value=""></option>
              <option value=""></option>
              <option value=""></option>
            </select>
            <form>
              <div>
                <div>
                  <label>Full Name</label>
                  <input type="text" />
                </div>
                <div>
                  <label>Role</label>
                  <select name="" id="">
                    <option value="">Role</option>
                    <option value="">Role</option>
                    <option value="">Role</option>
                  </select>
                </div>
              </div>
              <div>
                <label>Contact</label>
                <input type="number" />
              </div>
              <div>
                <label>Reg. Number</label>
                <input type="number" />
              </div>
              <button>SUBMIT</button>
            </form>
          </div>
        </div>
      </main>
      <Footer className={""} />
    </>
  );
};

export default JoinPlatform;
