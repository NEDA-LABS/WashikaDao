// Cards.tsx
export interface CardType {
  id: number;
  image: string;
  name: string;
  date: string;
  amount: number;
  status: string;
  proposalId: `0x${string}`;
  createdAt: number;
}

interface CardsProps {
  cards: CardType[];
}

interface CardItemProps {
  card: CardType;
}

const Cards: React.FC<CardsProps> = ({ cards }) => {
  if (cards.length === 0) {
    return <p>No loans to display</p>;
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

  return (
    <div className="card">
      <img
        src={card.image || "/images/default.png"}
        alt={card.image}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = "/images/default.png";
        }}
      />

{isApproved && <button className="onee">Release Funds</button>}

      <p>
        {/* {card.name.slice(0, 14)}…{card.name.slice(-9)} */}
        {card.name}
      </p>
      <p>{card.date}</p>
      <p className="cash">Tsh {card.amount.toLocaleString()}</p>

      <p className="status">Status: {expired ? card.status : "Active"}</p>
    </div>
  );
};

export default Cards;
