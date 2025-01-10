const cardData = [
  {
    id: 1,
    image: "/images/Image.png",
    name: "Jina la mwanachama",
    date: "10/02/2024",
    amount: "Tsh 340,000",
  },
  {
    id: 2,
    image: "/images/Image.png",
    name: "Jina la mwanachama",
    date: "10/02/2024",
    amount: "Tsh 340,000",
  },
  {
    id: 3,
    image: "/images/Image.png",
    name: "Jina la mwanachama",
    date: "10/02/2024",
    amount: "Tsh 340,000",
  },
  {
    id: 3,
    image: "/images/Image.png",
    name: "Jina la mwanachama",
    date: "10/02/2024",
    amount: "Tsh 340,000",
  },
  {
    id: 3,
    image: "/images/Image.png",
    name: "Jina la mwanachama",
    date: "10/02/2024",
    amount: "Tsh 340,000",
  },
  {
    id: 3,
    image: "/images/Image.png",
    name: "Jina la mwanachama",
    date: "10/02/2024",
    amount: "Tsh 340,000",
  },
];

const Cards = () => {
  return (
    <div className="cards">
      {cardData.map((card) => (
        <div className="card" key={card.id}>
          <img src={card.image} alt="" />
          <div className="buttonss">
            <button className="onee">Approve</button>
            <button className="twoo">Deny</button>
          </div>
          <p>{card.name}</p>
          <p>{card.date}</p>
          <p className="cash">{card.amount}</p>
        </div>
      ))}
    </div>
  );
};

export default Cards;
