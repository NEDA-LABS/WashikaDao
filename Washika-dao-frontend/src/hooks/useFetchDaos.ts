// utils/fetchDaos.ts
import { BASE_BACKEND_ENDPOINT_URL } from "../utils/backendComm.js";

export interface Dao {
  daoName: string;
  daoMultiSigAddr: string;
  multiSigPhoneNo: bigint;
}

export const fetchDaos = async (): Promise<Dao[]> => {
  const token = localStorage.getItem('token') ?? "";
  try {
    const response = await fetch(`${BASE_BACKEND_ENDPOINT_URL}/DaoGenesis/GetAllDaos`, {
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    console.log("Fetched DAOs:", data);

    if (Array.isArray(data.daoList)) {
      return data.daoList;
    } else {
      console.error("daoList is missing or not an array");
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch DAOs:", error);
    return [];
  }
};