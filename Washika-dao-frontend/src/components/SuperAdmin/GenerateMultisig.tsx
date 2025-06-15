import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { SafeFactory, SafeAccountConfig } from "@safe-global/protocol-kit";
import { useSigner } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import {
  addNotification,
  removeNotification,
  showNotificationPopup,
} from "../../redux/notifications/notificationSlice";
import { DaoDetails } from "./WanachamaList";

const SAFE_THRESHOLD = 3;

interface GenerateMultiSigProps {
  daoDetails: DaoDetails;
  setDaoDetails: (d: DaoDetails) => void;
}

export default function GenerateMultiSig({
  daoDetails,
  setDaoDetails,
}: GenerateMultiSigProps) {
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [isDeploying, setIsDeploying] = useState(false);
  const [showMemberPopup, setShowMemberPopup] = useState(false);
  const dispatch = useDispatch();

  const signer = useSigner();

  const deploySafe = useCallback(async () => {
    if (isDeploying) return;
    setIsDeploying(true);

    if (!signer) {
      alert("Please connect your wallet first.");
      setIsDeploying(false);
      return;
    }

    if (selectedMembers.length < SAFE_THRESHOLD) {
      alert(`Please select at least ${SAFE_THRESHOLD} members.`);
      setIsDeploying(false);
      return;
    }

    try {
      const safeAccountConfig: SafeAccountConfig = {
        owners: selectedMembers,
        threshold: SAFE_THRESHOLD,
      };

      if (!window.ethereum) {
        alert("No injected Ethereum provider found. Please install MetaMask.");
        setIsDeploying(false);
        return;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const provider = window.ethereum as any;
      const ownerAddress = await (signer as ethers.Signer).getAddress();

      const safeFactory = await SafeFactory.init({
        provider,
        signer: ownerAddress,
        // contractNetworks: { 44787: { safeSingletonAddress: “…”, … } }
      });

      const safeSdk = await safeFactory.deploySafe({ safeAccountConfig });

      const safeAddress = await safeSdk.getAddress();
      console.log("✅ Safe deployed at:", safeAddress);

      const id = crypto.randomUUID();
      dispatch(
        addNotification({
          id,
          type: "success",
          message: `Safe deployed at ${safeAddress}`,
        })
      );
      dispatch(showNotificationPopup());
      setTimeout(() => dispatch(removeNotification(id)), 5000);

      setDaoDetails({
        ...daoDetails,
        daoMultiSigAddr: safeAddress,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("❌ Safe deploy failed", err);
      alert(`Deployment failed: ${err.message || err}`);
    } finally {
      setIsDeploying(false);
      setShowMemberPopup(false);
      setSelectedMembers([]);
    }
  }, [
    isDeploying,
    selectedMembers,
    signer,
    dispatch,
    setDaoDetails,
    daoDetails,
  ]);

  return (
    <div>
      <button onClick={() => setShowMemberPopup(true)}>
        Generate MultiSig Address
      </button>

      {showMemberPopup && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Select Members for MultiSig</h2>
            <div className="overflow">
              {daoDetails?.members?.length ? (
                <ul className="member-list">
                  {daoDetails.members.map((member) => (
                    <li key={member.id}>
                      <label>
                        <input
                          type="checkbox"
                          value={member.wallet}
                          checked={selectedMembers.includes(member.wallet)}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (e.target.checked) {
                              setSelectedMembers((prev) => [...prev, value]);
                            } else {
                              setSelectedMembers((prev) =>
                                prev.filter((addr) => addr !== value)
                              );
                            }
                          }}
                        />
                        <span>{member.email}</span>
                        <small
                          style={{
                            display: "block",
                            fontSize: "0.8em",
                            color: "#666",
                          }}
                        >
                          {member.wallet}
                        </small>
                      </label>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No members found.</p>
              )}
            </div>

            <div className="modal-actions" style={{ marginTop: "1rem" }}>
              <button
                disabled={isDeploying}
                onClick={deploySafe}
                style={{ marginRight: "1rem" }}
              >
                {isDeploying ? "Deploying…" : "Generate MultiSig"}
              </button>
              <button
                className="cancel"
                onClick={() => {
                  setShowMemberPopup(false);
                  setSelectedMembers([]);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
