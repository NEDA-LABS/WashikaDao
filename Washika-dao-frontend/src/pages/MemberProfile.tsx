import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DaoForm from "../components/DaoForm";
import Dashboard from "../components/Dashboard";
import Footer from "../components/Footer";
import NavBar from "../components/Navbar/Navbar";
import { useMemberDaos } from "../components/Navbar/useMemberDaos";
import ProposalGroups from "../components/Proposals/ProposalGroups";
import { LoadingPopup } from "../components/SuperAdmin/LoadingPopup";
import { useReadContract, useSendAndConfirmTransaction } from "thirdweb/react";
import { prepareTransaction, readContract, toWei } from "thirdweb";
import { celoAlfajoresTestnet } from "thirdweb/chains";
import { OnChainProposal } from "../utils/Types";
import { client } from "../utils/thirdwebClient";
import { FullDaoContract } from "../utils/handlers/Handlers";

/**
 * @Auth policy: Should definitely be authenticated to make sense
 * @returns
 */
/**
 * Renders the MemberProfile component, which provides an overview of a DAO member's financial
 * information and activities. This component includes sections for credit score, financial
 * transactions, and current proposals. It utilizes various FontAwesome icons for visual
 * representation and includes navigation and footer components.
 *
 * @returns {JSX.Element} The JSX code for rendering the MemberProfile component.
 * @remarks This component is intended for authenticated users to view and manage their financial
 * data within the DAO platform.
 */
const MemberProfile: React.FC = () => {
  // const [guaranter, setGuaranter] = useState<string>("");
  const [showForm, setShowForm] = useState<boolean>(false); // State to toggle the popup form visibility
  const navigate = useNavigate();
  const [, setDaoToJoinId] = useState<string>("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [memberProposals, setMemberProposals] = useState<OnChainProposal[]>([]);
  const [selectedProposalId, setSelectedProposalId] = useState<`0x${string}`>();
  const [repayAmount, setRepayAmount] = useState<number>(0.1);

  const params = useParams<{ address: string }>();
  const memberAddr = params.address ?? "";

  const { daos } = useMemberDaos(memberAddr);

  useEffect(() => {
    const daoId = localStorage.getItem("selectedDaoId") as `0x${string}` | null;
    if (!daoId) return;
    (async () => {
      const raw = (await readContract({
        contract: FullDaoContract,
        method:
          "function getProposals(bytes32 _daoId) view returns ((address,bytes32,bytes32,string,string,string,uint256)[])",
        params: [daoId],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      })) as any[];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const proposals: OnChainProposal[] = raw.map((t: any) => ({
        proposalOwner: t[0] as `0x${string}`,
        proposalId: t[1] as `0x${string}`,
        daoId: t[2] as `0x${string}`,
        proposalUrl: t[3] as string,
        proposalTitle: t[4] as string,
        proposalStatus: t[5] as string,
        proposalCreatedAt: BigInt(t[6]),
      }));

      setMemberProposals(
        proposals.filter(
          (p) => p.proposalOwner.toLowerCase() === memberAddr.toLowerCase()
        )
      );
    })();
  }, [memberAddr]);

  // 2️⃣ Grab DAO creator address on demand
  const { mutate: payTx, status: payStatus } = useSendAndConfirmTransaction();

  const { data: daoCreatorAddr } = useReadContract({
    contract: FullDaoContract,
    method: "function getDaoCreatorByDaoId(bytes32) view returns (address)",
    params: [localStorage.getItem("selectedDaoId") as `0x${string}`],
  });

  // 3️⃣ “Pay” handler
  const handlePayment = () => {
    if (!daoCreatorAddr || !selectedProposalId) return;

    if (repayAmount < 0.1) {
      alert("Minimum repayment is 0.1 CELO");
      return;
    }

    const amount = repayAmount;

    const tx = prepareTransaction({
      to: daoCreatorAddr as `0x${string}`,
      value: toWei(amount.toString()),
      chain: celoAlfajoresTestnet,
      client,
    });

    payTx(tx, {
      onSuccess(r) {
        console.log("Paid back in tx", r.transactionHash);
        setShowPaymentModal(false);
      },
      onError(err) {
        console.error("Payment failed", err);
      },
    });
  };

  const handleDaoChange = (
    event: React.ChangeEvent<
      HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const selectedDaoName = event.target.value;

    // Find the selected DAO in the list based on its name
    const chosenDao = daos.find((dao) => dao.daoName === selectedDaoName);

    if (chosenDao) {
      setDaoToJoinId(chosenDao.daoId); // Save selected DAO’s address
    }
  };

  // Toggle the form popup visibility
  const handleAddMemberClick = () => {
    setShowForm(!showForm);
  };

  if (!memberAddr) {
    return <LoadingPopup message="Loading wallet…" />;
  }
  const handleClick = () => navigate("/CreateProposal");
  return (
    <>
      <NavBar className={"navbarDaoMember"} />
      <main className="member">
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

        <div className="button-group buttons">
          <button>Account Information</button>
          <button onClick={() => setShowPaymentModal(true)}>
            Make Payments
          </button>
          <button onClick={handleClick}>Apply for Loan</button>
          <button onClick={handleAddMemberClick}>Request Invite</button>
        </div>

        <div className="dashboard-wrapper">
          <h2>This is your account information</h2>
          <Dashboard address={memberAddr} />
        </div>
        <button className="create" onClick={() => navigate("/CreateProposal")}>
          Create a Proposal
        </button>
        <section className="second">
          <div className="sec">
            <img src="/images/Vector4.png" alt="logo" />
            <h1>My Proposals</h1>
          </div>
          <ProposalGroups ownerFilter={memberAddr} />
        </section>
        {showForm && (
          <div className=" popupp">
            <form>
              <DaoForm
                className="form"
                title="Apply to be a Member"
                description=""
                fields={[
                  {
                    label: "email",
                    type: "email",
                  },
                  {
                    label: "Select Dao",
                    type: "select",
                    options: [
                      {
                        label: "Select Dao",
                        value: "",
                        disabled: true,
                        selected: true,
                      },
                      ...daos.map((dao) => ({
                        label: dao.daoName,
                        value: dao.daoName,
                      })),
                    ],
                    onChange: handleDaoChange,
                  },
                ]}
              />
              <div className="center">
                <button className="createAccount" type="submit">
                  Submit
                </button>
                <button
                  className="closebtn"
                  type="button"
                  onClick={handleAddMemberClick}
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        )}

        {showPaymentModal && (
          <div className="popupp">
            <div className="payment-modal">
              <h2>Repay a Proposal</h2>
              <label>
                Select proposal:
                <select
                  value={selectedProposalId}
                  onChange={(e) =>
                    setSelectedProposalId(e.target.value as `0x${string}`)
                  }
                >
                  <option value=""></option>
                  {memberProposals.map((p) => (
                    <option key={p.proposalId} value={p.proposalId}>
                      {p.proposalTitle} (
                      {new Date(
                        Number(p.proposalCreatedAt) * 1000
                      ).toLocaleDateString()}
                      )
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Amount (CELO):
                <input
                  type="number"
                  min={0.1}
                  step={0.1}
                  value={repayAmount}
                  onChange={(e) => setRepayAmount(parseFloat(e.target.value))}
                />
              </label>

              <button
                onClick={handlePayment}
                disabled={!selectedProposalId || payStatus === "pending"}
              >
                {payStatus === "pending" ? "Sending…" : "Send Payment"}
              </button>
              <button onClick={() => setShowPaymentModal(false)}>Cancel</button>
            </div>
          </div>
        )}
      </main>
      <Footer className={"footerDaoMember"} />
    </>
  );
};

export default MemberProfile;
