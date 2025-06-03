import { useEffect, useState } from "react";
import { OnChainProposal } from "../../utils/Types";
import { prepareTransaction, readContract, toWei } from "thirdweb";
import { client, FullDaoContract } from "../../utils/handlers/Handlers";
import { celoAlfajoresTestnet } from "thirdweb/chains";
import { useSendAndConfirmTransaction, useReadContract } from "thirdweb/react";

interface RepaymentModalProps {
    memberAddr: string;
    showPaymentModal: boolean;
    setShowPaymentModal: (value: boolean) => void;
}
const RepaymentModal: React.FC<RepaymentModalProps> = ({memberAddr, showPaymentModal, setShowPaymentModal}) => {
  const [memberProposals, setMemberProposals] = useState<OnChainProposal[]>([]);
  const [selectedProposalId, setSelectedProposalId] = useState<`0x${string}`>();
  const [repayAmount, setRepayAmount] = useState<number>(0.1);

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
  return (
    <>
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
    </>
  );
};

export default RepaymentModal;
