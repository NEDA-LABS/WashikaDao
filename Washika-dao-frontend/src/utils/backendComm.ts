// eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
export const BASE_BACKEND_ENDPOINT_URL = import.meta.env.VITE_BASE_BACKEND_ENDPOINT_URL;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
export const ROUTE_PROTECTOR_KEY = import.meta.env.VITE_ROUTE_PROTECTOR;

export async function registerDaoOffchain(daoData: any) {
  const res = await fetch('/api/daos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(daoData),
  });
  if (!res.ok) throw new Error('Failed to register DAO in backend');
  return res.json();
}
