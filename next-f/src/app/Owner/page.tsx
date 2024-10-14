"use client";
import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import ProposalGroups from "@/components/ProposalGroups";
import Strip from "@/components/Strip";
import { useRouter } from "next/router";
import "@/styles/Owner.css";

const Owner: React.FC = () => {
  const router = useRouter();
  const handleClick = () => {
    router.push("/CreateProposal");
  };
  return (
    <>
      <NavBar className={"navbarOwner"} />
      <main className="owner">
        <div className="top">
          <div className="one">
            <h1>Hi, Shaila</h1>
            <p>Welcome to your one-stop platform for your DAO operations</p>
          </div>
          <img
            src="/images/Vector.png"
            alt="vector icon"
            width={48}
            height={114}
          />
        </div>

        <div className="button-group">
          <button className="button-1" onClick={handleClick}>
            Create a Proposal
          </button>
          <button className="button-2">Vote on a proposal</button>
        </div>

        <section className="second">
          <div className="myProposals">
            <img src="/images/proposalIcon.png" alt="dashboard icon" />
            <h2>My Proposals</h2>
          </div>

          <ProposalGroups />
        </section>
      </main>
      <Strip />
      <Footer className={"ownerFooter"} />
    </>
  );
};

export default Owner;
