// components/GroupInfo/GroupCard.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { celoAlfajoresTestnet } from "thirdweb/chains";
import {
  useReadContract,
  useWalletBalance,
} from "thirdweb/react";
import { FullDaoContract } from "../utils/handlers/Handlers";
import { fetchCeloToUsdRate } from "../utils/priceUtils";
import { client } from "../utils/thirdwebClient";

export interface Dao {
  daoName: string;
  daoLocation: string;
  daoObjective: string;
  daoTargetAudience: string;
  daoCreator: string;  // multisig address
  daoId: `0x${string}`;       // bytes32 id
}

interface GroupCardProps {
  group: Dao;
  isSmallScreen: boolean;
}

export default function GroupCard({ group, isSmallScreen }: GroupCardProps) {
  const [treasuryUsd, setTreasuryUsd] = useState<number | null>(null);
  const [memberCount, setMemberCount] = useState<number | null>(null);

  // 1️⃣ on-chain CELO balance
  const {
    data: balanceData,
    isLoading: balLoading,
  } = useWalletBalance({
    address: group.daoCreator,
    client,
    chain: celoAlfajoresTestnet,
  });

  // 2️⃣ on-chain member list
  const {
    data: onchainMembers,
    isLoading: membersLoading,
  } = useReadContract({
    contract: FullDaoContract,
    method:
      "function getDaoMembers(bytes32 _daoId) view returns ((string memberEmail, address memberAddress)[])",
    params: [group.daoId],
  });

  // compute USD balance once CELO balance arrives
  useEffect(() => {
    if (!balanceData) return;
    const celoBal = parseFloat(balanceData.displayValue);
    fetchCeloToUsdRate().then((rate) =>
      setTreasuryUsd(celoBal * rate)
    );
  }, [balanceData]);

  // count members once fetched
  useEffect(() => {
    if (!onchainMembers) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setMemberCount((onchainMembers as any[]).length);
  }, [onchainMembers]);

  // loading state
  if (balLoading || membersLoading || treasuryUsd == null || memberCount == null) {
    return <div className="group">Loading...</div>;
  }

  return (
    <div className="group">
      <Link
        to={`/DaoProfile/${group.daoId}`}
        state={{
            group,
            kiwango: treasuryUsd,
            memberCount,
          }}
      >
        <div className="image">
          <img
            src={group.daoId || "/images/default.png"}
            alt="DaoImage"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/images/default.png";
            }}
          />
          <div className="taarifaTop">Taarifa</div>
        </div>
        <div className="section-1">
          <div className="left">
            <h2>{group.daoName}</h2>
            <div className="location">
              <p>{group.daoLocation}</p>
              <img src="/images/location.png" />
            </div>
            <p className="email">
              {group.daoCreator
                ? isSmallScreen
                  ? `${group.daoCreator.slice(0, 14)}…${group.daoCreator.slice(-9)}`
                  : group.daoCreator
                : "N/A"}
            </p>
          </div>

          <div className="right">
            <h3>Treasury Value</h3>
            <div>
              <p className="currency">USD</p>
              <p className="amount">
                {treasuryUsd.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                USD
              </p>
            </div>
          </div>
        </div>

        <p className="section-2">{group.daoObjective}</p>

        <div className="section-3">
          <div className="top">
            <img src="/images/profile.png" alt="idadi" />
            <div className="taarifa">Member Information</div>
          </div>
          <div className="bottom">
            <h2>Members</h2>
            <p>{memberCount}</p>
          </div>
        </div>
      </Link>
    </div>
  );
}
