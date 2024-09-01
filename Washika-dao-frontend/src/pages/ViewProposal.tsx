import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import {useNavigate} from "react-router-dom";

interface ProposalData {
  title: string;
  description: string;
  amountRequested: string;
  currency: string;
  about: string;
}


const ViewProposal: React.FC = () => {
  const navigate = useNavigate();
  const handleBackClick = () => {
    navigate("/DaoProfile");
  };
  const proposalData: ProposalData = {
    title: "Proposal for Buying new spare part of machinery",
    description: 
      "We are Nipe Fagio, an environmental non-profit organization committed to cleaning and preserving our beaches. Our goal is to collect and remove at least 10 tons of plastic waste through community clean-up events and outreach programs."
    ,
    amountRequested: "3,000,000",
    currency: "Tsh",
    about: 
      "We are Nipe Fagio, an environmental non-profit organization committed to cleaning and preserving our beaches. Our goal is to collect and remove at least 10 tons of plastic waste through community clean-up events and outreach programs."
    ,
  };

  return (
    <>
      <NavBar className="navbarProposal" />
      <main className="viewProposal">
        <div className="one">
          <img src="/images/arrow-back-black.png" alt="arrow-black" width={99} height={99} onClick={handleBackClick}/>
          <button>Rejected</button>
        </div>

        <article>
          <h1>{proposalData.title}</h1>
          <p>{proposalData.description}</p>
        </article>

        <section>
          <button>View linked resources</button>
          <div>
            <p className="first">Amount Requested</p>
            <p className="second">
              {proposalData.amountRequested}
              <span>{proposalData.currency}</span>
            </p>
          </div>
        </section>

        <div className="about">
          <h1>About proposal</h1>
            <p>{proposalData.about}</p>
            <p>{proposalData.about}</p>
        </div>

        <div className="buttonGroup">
          <button className="one">View Votes</button>
          <button className="two">Re-propose</button>
          <button className="three">Fund Project</button>
        </div>
      </main>
      <Footer className="footerProposal"/>
    </>
  );
};

export default ViewProposal;
