import { useLoaderData, Link } from "react-router-dom";
import "../styles/index.css";

/**
 * @swagger
 * /daos:
 *   get:
 *     summary: List all DAOs (on-chain, merge backend)
 */
import { getAllDaos } from "../api/contract.js";

export async function loader() {
  try {
    const daos = await getAllDaos();
    // Optionally fetch and merge metadata from backend here
    return { daos };
  } catch (error) {
    console.error("Failed to load DAOs:", error);
    throw error;
  }
}

export default function DaosList() {
  const { daos } = useLoaderData() as { daos: any[] };

  return (
    <div className="dao-list max-w-3xl mx-auto mt-12 p-8 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6">All DAOs</h1>
      <ul className="space-y-4">
        {daos && daos.length > 0 ? (
          daos.map((dao) => (
            <li key={dao.daoId} className="border rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between hover:bg-gray-50 transition">
              <div>
                <div className="font-semibold text-lg">{dao.daoName}</div>
                <div className="text-gray-600">Location: {dao.daoLocation}</div>
                <div className="text-gray-600">Objective: {dao.daoObjective}</div>
                <div className="text-gray-600">Target Audience: {dao.daoTargetAudience}</div>
              </div>
              <Link
                to={`/daos/${dao.daoId}`}
                className="mt-4 md:mt-0 bg-yellow-600 text-white px-4 py-2 rounded shadow hover:bg-yellow-700 transition"
              >
                View DAO
              </Link>
            </li>
          ))
        ) : (
          <li className="text-gray-500">No DAOs found.</li>
        )}
      </ul>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error("DaosList Error:", error);
  return <div className="text-red-600 p-8">An error occurred: {error.message}</div>;
}

export function HydrateFallback() {
  return <div className="p-8">Loading DAOs...</div>;
} 