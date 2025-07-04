// Cards.tsx
import { useSendAndConfirmTransaction } from "thirdweb/react";
import { prepareTransaction, toWei } from "thirdweb";
import { celoAlfajoresTestnet } from "thirdweb/chains";
import { client } from "../../utils/thirdwebClient.js"; // your ThirdwebClient
// import { Link } from "react-router-dom";

export interface CardType {
  id: number;
  image: string;
  name: string;
  date: string;
  amount: number;
  status: string;
  proposalId: `0x${string}`;
  createdAt: number;
  ownerAddress: string;
}

interface CardsProps {
  cards: CardType[];
}

interface CardItemProps {
  card: CardType;
}

const Cards: React.FC<CardsProps> = ({ cards }) => {
  if (cards.length === 0) {
    return (
      <div className="noProposals">
        <p>No loans to display</p>
      </div>
    );
  }

  return (
    <div className="cards">
      {cards.map((card) => (
        <CardItem key={card.id} card={card} />
      ))}
    </div>
  );
};

const CardItem: React.FC<CardItemProps> = ({ card }) => {
  const now = Date.now();
  const expiryTs = card.createdAt + 24 * 3600 * 1000;
  const expired = now >= expiryTs;

  const isApproved = card.status.toLowerCase() === "approved";

  // 1️⃣ Hook to send a native-token transfer
  const {
    mutate: sendAndConfirm,
    status,
    error,
    data: receipt,
  } = useSendAndConfirmTransaction();

  const isLoading = status === "pending";

  const handleRelease = () => {
    const tx = prepareTransaction({
      to: card.ownerAddress,
      value: toWei(card.amount.toString()),
      chain: celoAlfajoresTestnet,
      client,
    });

    sendAndConfirm(tx, {
      onSuccess(r) {
        console.log("Funds released in tx", r.transactionHash);
      },
      onError(err) {
        console.error("Failed to release funds:", err);
      },
    });
  };
  return (
    <>
      <div className="card">
        <img
          src={card.image || "/images/default.png"}
          alt={card.image}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/images/default.png";
          }}
        />

        {isApproved && now >= expiryTs && (
          <button onClick={handleRelease} disabled={isLoading}>
            {isLoading ? "Releasing…" : "Release Funds"}
          </button>
        )}

        <p>{card.name}</p>
        <p className="name">{card.ownerAddress}</p>
        <p>{card.date}</p>
        <p className="cash">Celo: {card.amount.toLocaleString()}</p>

        <p className="status">Status: {expired ? card.status : "Active"}</p>

        {error && <p className="error">Error: {error.message}</p>}
        {error && <p className="error">{error.message}</p>}
        {receipt && (
          <p className="success name">Tx: {receipt.transactionHash}</p>
        )}
      </div>
    </>
  );
};

export default Cards;
