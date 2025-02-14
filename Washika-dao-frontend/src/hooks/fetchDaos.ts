// utils/fetchDaos.ts
import { baseUrl } from "../utils/backendComm";

export interface Dao {
  daoName: string;
  daoMultiSigAddr: string;
  multiSigPhoneNo: bigint;
}

export const fetchDaos = async (): Promise<Dao[]> => {
  try {
    const response = await fetch(`http://${baseUrl}/DaoGenesis/GetAllDaos`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
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