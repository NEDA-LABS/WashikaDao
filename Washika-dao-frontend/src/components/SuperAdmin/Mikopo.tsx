import { useState, useMemo, useEffect } from "react";
import Cards, { CardType } from "./Cards";
import { useReadContract } from "thirdweb/react";
import { FullDaoContract } from "../../utils/handlers/Handlers";
import { OnChainProposal } from "../../utils/Types";
import { readContract } from "thirdweb";

const statusOptions = [
  { key: "active", label: "Active", desc: "Awaiting approval" },
  { key: "approved", label: "Approved", desc: "Loans approved" },
  { key: "rejected", label: "Rejected", desc: "Loans rejected" },
  { key: "paid", label: "Paid", desc: "Loans fully paid back" },
];

const ZERO_BYTES32 =
  "0x0000000000000000000000000000000000000000000000000000000000000000" as const;

export default function Mikopo() {
  const daoId = (localStorage.getItem("daoId") ||
    ZERO_BYTES32) as `0x${string}`;

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

  const mappedCards: CardType[] = useMemo(
    () =>
      rawProposals.map((p, idx) => ({
        id: idx + 1,
        image: "/images/default.png",
        name: p.proposalOwner,
        date: new Date(Number(p.proposalCreatedAt) * 1000).toLocaleDateString(),
        amount: 0,
        status: p.proposalStatus.toLowerCase(),
        proposalId: p.proposalId,
        createdAt: Number(p.proposalCreatedAt) * 1000,
      })),
    [rawProposals]
  );

  const [cards, setCards] = useState<CardType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [maxAmount, setMaxAmount] = useState(0);
  const [sortOption, setSortOption] = useState<"new" | "owed" | "paid" | "fee">(
    "new"
  );

  useEffect(() => {
    async function fetchOutcomes() {
      const updatedCards = await Promise.all(
        mappedCards.map(async (card) => {
          const expiryTs = card.createdAt + 24 * 3600 * 1000;
          const now = Date.now();

          if (now >= expiryTs) {
            try {
              const outcome = await readContract({
                contract: FullDaoContract,
                method:
                  "function getProposalOutcome(bytes32 proposalId) view returns (string)",
                params: [card.proposalId],
              });

              return { ...card, status: outcome?.toLowerCase() ?? card.status };
            } catch (err) {
              console.error(
                "Failed to fetch outcome for",
                card.proposalId,
                err
              );
              return card;
            }
          }
          return card;
        })
      );

      setCards(updatedCards);
      setMaxAmount(Math.max(...updatedCards.map((c) => c.amount), 0));
    }

    if (!isLoading && !error && mappedCards.length > 0) {
      fetchOutcomes();
    }
  }, [isLoading, error, mappedCards]);

  const initialMaxAmount = useMemo(
    () => Math.max(...cards.map((c) => c.amount), 0),
    [cards]
  );

  const toggleStatus = (status: string) =>
    setStatusFilters((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );

  const displayedCards = useMemo(() => {
    let filtered = [...cards];

    // Apply search
    if (searchTerm.trim()) {
      const keywords = searchTerm.trim().toLowerCase().split(/\s+/);
      filtered = filtered.filter((c) =>
        keywords.every((kw) =>
          [c.name, c.date, c.amount.toString()].some((field) =>
            field.toLowerCase().includes(kw)
          )
        )
      );
    }

    // Apply status filters
    if (statusFilters.length > 0) {
      filtered = filtered.filter((c) => statusFilters.includes(c.status));
    }

    // Apply amount filter
    filtered = filtered.filter((c) => c.amount <= maxAmount);

    // Apply sorting or fallback status-based filters
    if (statusFilters.length === 0) {
      switch (sortOption) {
        case "owed":
          filtered = filtered.filter((c) => c.status === "approved");
          break;
        case "paid":
          filtered = filtered.filter((c) => c.status === "paid");
          break;
        case "fee":
          filtered.sort((a, b) => a.amount - b.amount);
          break;
        case "new":
        default:
          filtered.sort((a, b) => b.createdAt - a.createdAt);
          break;
      }
    } else {
      // Sort within the selected statuses
      if (sortOption === "fee") {
        filtered.sort((a, b) => a.amount - b.amount);
      } else {
        filtered.sort((a, b) => b.createdAt - a.createdAt);
      }
    }

    return filtered;
  }, [cards, searchTerm, statusFilters, maxAmount, sortOption]);

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

          {/* Status Filters */}
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

          {/* Amount Range Filter */}
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

        {/* Right side: Search + Sort + Cards */}
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

          <Cards cards={displayedCards} />
        </div>
      </section>
    </>
  );
}
