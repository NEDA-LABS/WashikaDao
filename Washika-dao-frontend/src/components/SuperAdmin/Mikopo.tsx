import { useState, useMemo, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  addNotification,
  removeNotification,
  showNotificationPopup,
} from "../../redux/notifications/notificationSlice";
import Cards, { CardType } from "./Cards";
import { useReadContract } from "thirdweb/react";
import { FullDaoContract } from "../../utils/handlers/Handlers";

interface OnChainProposal {
  proposalOwner: string;
  proposalId: string;
  daoId: string;
  proposalUrl: string;
  proposalTitle: string;
  proposalStatus: string;
  proposalCreatedAt: bigint;
}


const statusOptions = [
  { key: "pending", label: "Pending", desc: "Awaiting approval" },
  { key: "approved", label: "Approved", desc: "Loans approved" },
  { key: "denied", label: "Denied", desc: "Loans denied" },
  { key: "paid", label: "Paid", desc: "Loans fully paid back" },
];


const ZERO_BYTES32 =
  "0x0000000000000000000000000000000000000000000000000000000000000000" as const;

  export default function Mikopo() {
  const dispatch = useDispatch();
  const daoId = (localStorage.getItem("daoId") || ZERO_BYTES32) as `0x${string}`;

  // 1) Fetch on-chain proposals
  const {
    data: rawProposals = [],
    isLoading,
    error,
  } = useReadContract({
    contract: FullDaoContract,
    method:
      "function getProposals(bytes32 _daoId) view returns ((address proposalOwner, bytes32 proposalId, bytes32 daoId, string proposalUrl, string proposalTitle, string proposalStatus, uint256 proposalCreatedAt)[])",
    params: [daoId] as const,
  }) as {
    data?: OnChainProposal[];
    isLoading: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any;
  };

  // 2) Map to CardType
  const mappedCards: CardType[] = useMemo(
    () =>
      rawProposals.map((p, idx) => ({
        id: idx + 1,
        image: "/images/default.png",
        name: p.proposalOwner,
        // convert seconds (bigint) → ms → locale date
        date: new Date(Number(p.proposalCreatedAt) * 1000).toLocaleDateString(),
        amount: 0, // or fetch amountRequested if you extend OnChainProposal
        status: p.proposalStatus as string,
      })),
    [rawProposals]
  );

  // Local state for filtering/sorting
  const [cards, setCards] = useState<CardType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [maxAmount, setMaxAmount] = useState(0);
  const [sortOption, setSortOption] = useState<"new" | "owed" | "paid" | "fee">(
    "new"
  );

  // When raw proposals arrive, bootstrap state
  useEffect(() => {
    if (!isLoading && !error) {
      setCards(mappedCards);
      // set maxAmount based on incoming amounts
      setMaxAmount(Math.max(...mappedCards.map((c) => c.amount), 0));
    }
  }, [isLoading, error, mappedCards]);

  // derive initialMaxAmount
  const initialMaxAmount = useMemo(
    () => Math.max(...cards.map((c) => c.amount), 0),
    [cards]
  );

  // toggle status filter
  const toggleStatus = (status: string) => {
    setStatusFilters((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  // Filter & sort logic (unchanged)
  const displayedCards = useMemo(() => {
    let filtered = cards.filter((c) => {
      const keywords = searchTerm.trim().toLowerCase().split(/\s+/);
      return keywords.every((kw) =>
        [c.name, c.date, c.amount.toString()].some((field) =>
          field.toLowerCase().includes(kw)
        )
      );
    });

    if (statusFilters.length > 0) {
      filtered = filtered.filter((c) => statusFilters.includes(c.status));
    }

    filtered = filtered.filter((c) => c.amount <= maxAmount);

    switch (sortOption) {
      case "new":
        filtered.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        break;
      case "owed":
        filtered = filtered.filter((c) => c.status === "approved");
        break;
      case "paid":
        filtered = filtered.filter((c) => c.status === "paid");
        break;
      case "fee":
        filtered.sort((a, b) => a.amount - b.amount);
        break;
    }
    return filtered;
  }, [cards, searchTerm, statusFilters, maxAmount, sortOption]);

  // Handlers (approve/deny) now refer to CardType.name, status etc.
  const handleApprove = (id: number) => {
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "approved" } : c))
    );
    const approved = cards.find((c) => c.id === id);
    if (approved) {
      const noteId = crypto.randomUUID();
      dispatch(
        addNotification({
          id: noteId,
          type: "success",
          message: `Proposal by ${approved.name} approved`,
          section: "mikopo",
        })
      );
      dispatch(showNotificationPopup());
      setTimeout(() => dispatch(removeNotification(noteId)), 10000);
    }
  };

  const handleDeny = (id: number) => {
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "denied" } : c))
    );
    const denied = cards.find((c) => c.id === id);
    if (denied) {
      const noteId = crypto.randomUUID();
      dispatch(
        addNotification({
          id: noteId,
          type: "error",
          message: `Proposal by ${denied.name} denied`,
          section: "mikopo",
        })
      );
      dispatch(showNotificationPopup());
      setTimeout(() => dispatch(removeNotification(noteId)), 10000);
    }
  };

  if (isLoading) return <div>Loading proposals…</div>;
  if (error) return <div>Error loading proposals.</div>;

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
                  Lowest Amount{" "}
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
              Lowest Amount
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
