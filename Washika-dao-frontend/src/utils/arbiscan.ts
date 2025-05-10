// utils/arbiscan.ts

export interface RawTxn {
  hash: string;
  timestamp: number; // seconds since epoch
  from: string;
  to: string;
  valueCelo: number; // in ETH
  isInternal: boolean; // new flag
}

const BLOCKSCOUT_BASE = "https://celo-alfajores.blockscout.com/api";

export async function fetchTokenTransfers(
  address: string,
  page = 1,
  offset = 100
): Promise<RawTxn[]> {
  const url = `${BLOCKSCOUT_BASE}?module=account
    &action=tokentx
    &address=${address}
    &startblock=0
    &endblock=99999999
    &page=${page}
    &offset=${offset}
    &sort=desc`.replace(/\s+/g, "");

  const res = await fetch(url);
  const { status, result } = await res.json();
  if (status !== "1") return [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (result as any[]).map((tx) => ({
    hash: tx.hash,
    timestamp: Number(tx.timeStamp),
    from: tx.from,
    to: tx.to,
    valueCelo: Number(tx.value) / 1e18,
    isInternal: false,
  }));
}