import { useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { addNotification } from "../../redux/notifications/notificationSlice";
import Cards, { CardType } from "./Cards";

// initial dummy data with loan status
const initialCardData: CardType[] = [
  {
    id: 1,
    image: "/images/Image.png",
    name: "Jina la mwanachama A",
    date: "10/02/2024",
    amount: 340000,
    status: "pending",
  },
  {
    id: 2,
    image: "/images/Image.png",
    name: "Jina la mwanachama B",
    date: "11/02/2024",
    amount: 150000,
    status: "pending",
  },
  {
    id: 3,
    image: "/images/Image.png",
    name: "Jina la mwanachama C",
    date: "12/02/2024",
    amount: 500000,
    status: "pending",
  },
  {
    id: 4,
    image: "/images/Image.png",
    name: "Jina la mwanachama D",
    date: "13/02/2024",
    amount: 250000,
    status: "pending",
  },
  {
    id: 5,
    image: "/images/Image.png",
    name: "Jina la mwanachama E",
    date: "14/02/2024",
    amount: 420000,
    status: "pending",
  },
  {
    id: 6,
    image: "/images/Image.png",
    name: "Jina la mwanachama F",
    date: "15/02/2024",
    amount: 310000,
    status: "pending",
  },
];

// derive the maximum amount for slider
const initialMaxAmount = Math.max(...initialCardData.map((c) => c.amount));

const statusOptions = [
  { key: "pending", label: "Pending", desc: "Awaiting approval" },
  { key: "approved", label: "Approved", desc: "Loans approved" },
  { key: "denied", label: "Denied", desc: "Loans denied" },
];

type SortOption = "new" | "owed" | "paid" | "fee";

export default function Mikopo() {
  const dispatch = useDispatch();
  const [cards, setCards] = useState<CardType[]>(initialCardData);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [maxAmount, setMaxAmount] = useState<number>(initialMaxAmount);
  const [sortOption, setSortOption] = useState<SortOption>("new");

  // toggle status filter
  const toggleStatus = (status: string) => {
    setStatusFilters((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  // Filter & sort logic
  const displayedCards = useMemo(() => {
    const keywords = searchTerm.trim().split(/\s+/).filter(Boolean);

    // keyword filter
    const byKeyword = cards.filter((c) =>
      keywords.every(
        (kw) =>
          c.name.toLowerCase().includes(kw.toLowerCase()) ||
          c.date.toLowerCase().includes(kw.toLowerCase()) ||
          c.amount.toString().includes(kw)
      )
    );

    // status filter
    const byStatus =
      statusFilters.length > 0
        ? byKeyword.filter((c) => statusFilters.includes(c.status))
        : byKeyword;

    // amount filter
    const byAmount = byStatus.filter((c) => c.amount <= maxAmount);

    // sort
    const sorted = [...byAmount];
    switch (sortOption) {
      case "new":
        sorted.sort((a, b) => b.id - a.id);
        break;
      case "owed":
        // treat amount > 300k as 'owed'
        return sorted.filter((c) => c.amount > 300000);
      case "paid":
        return sorted.filter((c) => c.amount <= 300000);
      case "fee":
        sorted.sort((a, b) => a.amount - b.amount);
        break;
    }
    return sorted;
  }, [cards, searchTerm, statusFilters, maxAmount, sortOption]);

  const handleApprove = (id: number) => {
    setCards((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: "approved" } : c
      )
    );
    const approved = cards.find((c) => c.id === id);
    if (approved) {
      dispatch(
        addNotification({
          id: crypto.randomUUID(),
          type: "success",
          message: `Loan approved for ${approved.name}`,
          section: "mikopo",
        })
      );
    }
  };

  const handleDeny = (id: number) => {
    setCards((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: "denied" } : c
      )
    );
    const denied = cards.find((c) => c.id === id);
    if (denied) {
      dispatch(
        addNotification({
          id: crypto.randomUUID(),
          type: "error",
          message: `Loan denied for ${denied.name}`,
          section: "mikopo",
        })
      );
    }
  };

  return (
    <>
      <h2 className="heading">List of All Members with Loans</h2>
      <section className="thirdy">
        <div className="left">
          <div className="one components">
            <h2>Active Filters</h2>
            <ul>
              {searchTerm && (
                <li>
                  Name{" "}
                  <img
                    src="/images/X.png"
                    alt="clear name"
                    onClick={() => setSearchTerm("")}
                  />
                </li>
              )}
              {maxAmount < initialMaxAmount && (
                <li>
                  Amount{" "}
                  <img
                    src="/images/X.png"
                    alt="clear amount"
                    onClick={() => setMaxAmount(initialMaxAmount)}
                  />
                </li>
              )}
              {sortOption === "fee" && (
                <li>
                  Fee{" "}
                  <img
                    src="/images/X.png"
                    alt="clear fee"
                    onClick={() => setSortOption("new")}
                  />
                </li>
              )}
              {statusFilters.map((status) => {
                const opt = statusOptions.find((o) => o.key === status);
                return (
                  <li key={status}>
                    {opt?.label}{" "}
                    <img
                      src="/images/X.png"
                      alt={`clear ${status}`}
                      onClick={() => toggleStatus(status)}
                    />
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="two components">
            {statusOptions.map((opt) => (
              <div className="content" key={opt.key}>
                <input
                  type="checkbox"
                  id={opt.key}
                  checked={statusFilters.includes(opt.key)}
                  onChange={() => toggleStatus(opt.key)}
                />
                <div>
                  <label htmlFor={opt.key}>{opt.label}</label>
                  <p>{opt.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="components">
            <div>
              <label>Amount (0 - {initialMaxAmount.toLocaleString()})</label>
              <p>Up to {maxAmount.toLocaleString()}</p>
            </div>
            <input
              type="range"
              min={0}
              max={initialMaxAmount}
              value={maxAmount}
              onChange={(e) => setMaxAmount(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="right">
          <div className="one">
            <div className="search">
              <input
                type="search"
                placeholder="Search keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <img src="/images/Search.png" alt="Search" />
            </div>

            <div
              className={`sort ${sortOption === "new" ? "active" : ""}`}
              onClick={() => setSortOption("new")}
            >
              {sortOption === "new" && (
                <img src="/images/Check.png" alt="selected" />
              )}
              New Loans
            </div>
            <div
              className={`sort ${sortOption === "owed" ? "active" : ""}`}
              onClick={() => setSortOption("owed")}
            >
              {sortOption === "owed" && (
                <img src="/images/Check.png" alt="selected" />
              )}
              Outstanding Loans
            </div>
            <div
              className={`sort ${sortOption === "paid" ? "active" : ""}`}
              onClick={() => setSortOption("paid")}
            >
              {sortOption === "paid" && (
                <img src="/images/Check.png" alt="selected" />
              )}
              Paid Loans
            </div>
            <div
              className={`sort ${sortOption === "fee" ? "active" : ""}`}
              onClick={() => setSortOption("fee")}
            >
              {sortOption === "fee" && (
                <img src="/images/Check.png" alt="selected" />
              )}
              Fees
            </div>
          </div>

          <Cards
            cards={displayedCards}
            onApprove={handleApprove}
            onDeny={handleDeny}
          />
        </div>
      </section>
    </>
  );
}
