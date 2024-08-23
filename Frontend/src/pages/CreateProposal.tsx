import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import { useNavigate } from "react-router-dom";

const CreateProposal: React.FC = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/ViewProposal')
  }
  return (
    <>
      <NavBar className={""} />
      <main className="createProposal">
        <div className="proposalParag">
          <div className="top">
            <h1>Create a proposal</h1>
            <img src="/images/arrow-back.png" alt="arrow-back" />
          </div>

          <p>
            Provide the information voters will need to make their decision
            here.
          </p>
        </div>

        <div className="circle-container">
          <div className="circle one">1</div>
          <div className="line"></div>
          <div className="circle">2</div>
          <div className="line"></div>
          <div className="circle">3</div>
          <div className="line"></div>
          <div className="circle">4</div>
        </div>

        <form>
          <div className="label one">
            <label> Owner of the proposal </label>
            <button>Connect wallet</button>
          </div>
          <div className="label two">
            <label>Title of proposal</label>
            <input type="text" />
          </div>
          <div className="label three">
            <label>Summary of project</label>
            <textarea name="" id=""></textarea>
          </div>
          <div className="label four">
            <label className="andika">
              Andika taarifa fupi ya mchango wako
            </label>
            <textarea name="" id="" placeholder="Anza hapa..."></textarea>
          </div>
          <div className="label five">
            <label>Amount Ask</label>
            <input type="number" />
          </div>
          <div className="six">
            <div>
              <input type="file" />
            </div>
            <button onClick={handleClick}>SUBMIT PROPOSAL</button>
          </div>
        </form>
      </main>
      <Footer className={""}/>
    </>
  );
};

export default CreateProposal;
