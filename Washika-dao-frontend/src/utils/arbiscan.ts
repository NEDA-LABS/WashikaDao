// utils/arbiscan.ts

export interface RawTxn {
    hash: string;
    timestamp: number;    // seconds since epoch
    from: string;
    to: string;
    valueEth: number;     // in ETH
    isInternal: boolean;  // new flag
  }
  
  const ARBISCAN_BASE = "https://api-sepolia.arbiscan.io/api";
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  const API_KEY = import.meta.env.VITE_ARBISCAN_API_KEY;
  
  // 1) Fetch regular (EOA‑initiated) txns
  async function fetchOnChain(
    address: string,
    page = 1,
    offset = 100
  ): Promise<RawTxn[]> {
    const url = `${ARBISCAN_BASE}?module=account
      &action=txlist
      &address=${address}
      &startblock=0
      &endblock=99999999
      &page=${page}
      &offset=${offset}
      &sort=desc
      &apikey=${API_KEY}`
      .replace(/\s+/g, "");
  
    const res = await fetch(url);
    const { status, result } = await res.json();
    if (status !== "1") return [];
  
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (result as any[]).map((tx) => ({
      hash: tx.hash,
      timestamp: Number(tx.timeStamp),
      from: tx.from,
      to: tx.to,
      valueEth: Number(tx.value) / 1e18,
      isInternal: false,
    }));
  }
  
  // 2) Fetch internal (contract‑to‑contract) traces
  async function fetchInternal(
    address: string,
    page = 1,
    offset = 100
  ): Promise<RawTxn[]> {
    const url = `${ARBISCAN_BASE}?module=account
      &action=txlistinternal
      &address=${address}
      &startblock=0
      &endblock=99999999
      &page=${page}
      &offset=${offset}
      &sort=desc
      &apikey=${API_KEY}`
      .replace(/\s+/g, "");
  
    const res = await fetch(url);
    const { status, result } = await res.json();
    if (status !== "1") return [];
  
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (result as any[]).map((tx) => ({
      hash: tx.hash,               // same parent tx‑hash
      timestamp: Number(tx.timeStamp),
      from: tx.from,
      to: tx.to,
      valueEth: Number(tx.value) / 1e18,
      isInternal: true,
    }));
  }
  
  // 3) Combine & sort
  export async function fetchAllTransactions(
    address: string,
    page = 1,
    offset = 100
  ): Promise<RawTxn[]> {
    // parallel fetch
    const [onChain, internal] = await Promise.all([
      fetchOnChain(address, page, offset),
      fetchInternal(address, page, offset),
    ]);
  
    // merge & sort newest first
    return [...onChain, ...internal].sort(
      (a, b) => b.timestamp - a.timestamp
    );
  }
  