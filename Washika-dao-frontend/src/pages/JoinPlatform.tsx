import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import DaoForm from "../components/DaoForm";

const JoinPlatform: React.FC = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/Funder");
  };
  const handleSubmit = () => {
    navigate("/Owner");
  };
  return (
    <>
      <NavBar className={""} />
      <main className="daoRegistration join">
        <div className="funguaKikundi">
          <h1>Create, manage and fund community impact projects</h1>
          <p>Welcome to a one-stop platform for your DAO operations</p>
        </div>

        <div className="circle-container">
          <div className="circle one">1</div>
          <div className="line"></div>
          <div className="circle">2</div>
          <div className="line"></div>
          <div className="circle">3</div>
          <div className="line"></div>
          <div className="circle">4</div>
          <div className="line"></div>
          <div className="circle">5</div>
        </div>

        <form className="combinedForms" onSubmit={handleClick}>
          <DaoForm
            className="form one"
            title="Tell us About yourself"
            description="Create a free account"
            fields={[
              { label: "First Name", type: "text" },
              { label: "Last Name", type: "text" },
              { label: "Email", type: "email" },
              {
                label: "Role",
                type: "select",
                options: [
                  { label: "Admin", value: "admin" },
                  { label: "User", value: "user" },
                  { label: "Guest", value: "guest" },
                ],
              },
              { label: "Password", type: "Password" },
              { label: "Confirm Password*", type: "Password" },
            ]}
          />
        </form>

        <DaoForm
          className="hazina digitalWallet"
          title="Digital Wallet"
          description="Connect and fund impact DAOs and community saving groups"
          fields={[
            {
              label: "Connect wallet/acc",
              type: "button",
              name: "connect-wallet",
              id: "connect-wallet",
            },
            { label: "Fill in your Digital wallet ID", type: "text" },
          ]}
        />
        <div className="button-container">
          {" "}
          <button className="createDao">Create DAO</button>
          <button className="joinDao">
            <p>Join a DAO</p>
            <img src="/images/arrowright.png" alt="arrowRight" />
          </button>
        </div>
        <div className="findAndJoin">
          <div className="one">
            <h2>Find and join your DAO with ease</h2>
            <p>Find and connect with your DAO and start participating</p>
            <div className="image">
              <img src="/images/Group.png" alt="group icon" />
            </div>
          </div>
          <form className="two" onSubmit={handleSubmit}>
            <select name="dao" id="dao" className="select-1" defaultValue="">
              <option value="" disabled hidden>
                Select your DAO
              </option>
              <option value="dao1">DAO 1</option>
              <option value="dao2">DAO 2</option>
              <option value="dao3">DAO 3</option>
            </select>
            <div className="formDiv">
              <div className="first">
                <div className="input">
                  <label>Full name</label>
                  <input type="text" />
                </div>
                <div className="input">
                  <label>Role</label>
                  <input type="number" className="short" />
                </div>
              </div>
              <div className="input">
                <label>Contact</label>
                <input type="number" />
              </div>
              <div className="input">
                <label>Reg Number</label>
                <input type="number" />
              </div>
              <button>SUBMIT</button>
            </div>
          </form>
        </div>
      </main>
      <Footer className={""} />
    </>
  );
};

export default JoinPlatform;
