
// Cards.tsx
export interface CardType {
  id: number;
  image: string;
  name: string;
  date: string;
  amount: number; // store as number for sorting
  status: string;
}

interface CardsProps {
  cards: CardType[];
  onApprove: (id: number) => void;
  onDeny: (id: number) => void;
}

const Cards = ({ cards, onApprove, onDeny }: CardsProps) => {
  if (cards.length === 0) {
    return <p>No loans to display</p>;
  }

  return (
    <div className="cards">
      {cards.map((card) => (
        <div className="card" key={card.id}>
          <img src={card.image} alt={card.name} />
          <div className="buttonss">
            <button className="onee" onClick={() => onApprove(card.id)}>
              Approve
            </button>
            <button className="twoo" onClick={() => onDeny(card.id)}>
              Deny
            </button>
          </div>
          <p>{card.name}</p>
          <p>{card.date}</p>
          <p className="cash">Tsh {card.amount.toLocaleString()}</p>
          <p className="status">Status: {card.status}</p>
        </div>
      ))}
    </div>
  );
};

export default Cards;
