import { useActiveWallet } from "thirdweb/react";
import { inAppWallet } from "thirdweb/wallets";
export default function getCurrentConnectedAccount(){
    const activeWallet = useActiveWallet();
    if(activeWallet !== null || activeWallet !== undefined){
    return activeWallet;
    console.log(activeWallet);
    }
    return null;

}

export function getCurrentConnectedAccount2(){
 const activeWallet = inAppWallet();
 console.log(activeWallet);
 return activeWallet;

}
//import { Navigate } from 'react-router-dom';
//import { useAddress } from 'thirdweb/react';

/*
interface ProtectedRouteProps {
  children: React.ReactNode;
}
*/

//const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
//  const address = useAddress();
/*
  if (!address) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

//export default ProtectedRoute;

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/auth/ProtectedRoute';
*/
/**
const SampleApp = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */
        {/*
        <Route path="/" element={<HomePage />} />
        <Route path="/blogs" element={<BlogsPage />} />

        {/* Protected Routes - Need wallet connection */}
/*
        <Route
          path="/ListOfDaos"
          element={
            <ProtectedRoute>
              <ListOfDaosPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/DaoRegistration"
          element={
            <ProtectedRoute>
              <DaoRegistration />
            </ProtectedRoute>
          }
        />
        {/**  Add other protected routes here */
   //   </Routes>
   // </Router>
  //*/}
 // */
 // );
//};

//daoUtils.ts
//import { useContract, useContractRead } from "thirdweb/react";
/*
interface DAOMembershipStatus {
  isAdmin: boolean;
  isMember: boolean;
  isLoading: boolean;
  error: Error | null;
}

export function useCheckDAOMembership(daoAddress: string, userAddress: string): DAOMembershipStatus {
  const { contract } = useContract(daoAddress);

  // Check member status
  const { data: isMember, isLoading: memberLoading, error: memberError } = useContractRead(
    contract,
    "isMember",
    [userAddress]
  );

  // Check admin status
  const { data: isAdmin, isLoading: adminLoading, error: adminError } = useContractRead(
    contract,
    "hasRole",
    ["ADMIN_ROLE", userAddress]
  );

  return {
    isAdmin: !!isAdmin,
    isMember: !!isMember,
    isLoading: memberLoading || adminLoading,
    error: memberError || adminError
  };
}
//DaoCard.tsx--> DaoList or DaoDetail
import { useAddress } from "thirdweb/react";
import { useCheckDAOMembership } from "../../utils/daoUtils";

interface DAOCardProps {
  daoAddress: string;
  daoName: string;
}

const DAOCard: React.FC<DAOCardProps> = ({ daoAddress, daoName }) => {
  const userAddress = useAddress();
  const { isAdmin, isMember, isLoading, error } = useCheckDAOMembership(daoAddress, userAddress || "");

  if (isLoading) {
    return <div>Checking membership...</div>;
  }

  if (error) {
    return <div>Error checking membership</div>;
  }

  return (
    <div className="dao-card">
      <h3>{daoName}</h3>
      <p>Status: {isAdmin ? "Admin" : isMember ? "Member" : "Not a member"}</p>
      {isMember ? (
        */
       /*
        //<button onClick={() => /* navigate to DAO dashboard */
          /*
          Enter DAO
        </button>
      ) : (
        <button onClick={() => /* show join DAO modal */
          /*
          Join DAO
        </button>
      )}
    </div>
  );
};

//ListOfDaosPage.tsx
import { useAddress } from "thirdweb/react";
import DAOCard from "../components/dao/DAOCard";

const ListOfDaosPage: React.FC = () => {
  // Assuming you're fetching DAOs from somewhere
  const [daos, setDaos] = useState<Array<{ address: string; name: string }>>([]);
  const userAddress = useAddress();

  return (
    <div className="daos-grid">
      {daos.map((dao) => (
        <DAOCard
          key={dao.address}
          daoAddress={dao.address}
          daoName={dao.name}
        />
      ))}
    </div>
  );
};

//localStorageUtils.ts
const CACHE_KEY = 'dao_memberships_cache';
const CACHE_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

export const getMembershipCache = () => {
  const cached = localStorage.getItem(CACHE_KEY);
  if (!cached) return {};

  try {
    const { data, timestamp } = JSON.parse(cached);

    // Check if cache is expired
    if (Date.now() - timestamp > CACHE_DURATION) {
      localStorage.removeItem(CACHE_KEY);
      return {};
    }

    return data;
  } catch {
    return {};
  }
};

export const setMembershipCache = (data: any) => {
  const cacheData = {
    data,
    timestamp: Date.now()
  };
  localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
};
//daoUtils.ts
import { useContract } from "thirdweb/react";
import { getMembershipCache, setMembershipCache } from "./localStorageUtils";

export async function checkMembership(userAddress: string, daoAddress: string) {
  const cache = getMembershipCache();

  // Check if we have cached data
  if (cache[userAddress] && cache[userAddress][daoAddress]) {
    return cache[userAddress][daoAddress];
  }

  const { contract } = useContract(daoAddress);

  try {
    const isAdmin = await contract.call("hasRole", ["ADMIN_ROLE", userAddress]);
    const isMember = await contract.call("isMember", [userAddress]);

    // Update cache
    if (!cache[userAddress]) {
      cache[userAddress] = {};
    }
    cache[userAddress][daoAddress] = { isAdmin, isMember };
    setMembershipCache(cache);

    return { isAdmin, isMember };
  } catch (error) {
    console.error("Error checking membership:", error);
    return { isAdmin: false, isMember: false }; // Default to false on error
  }
}
//ListOfDaoPage.tsx
import { useAddress } from "thirdweb/react";
import { useState, useEffect } from "react";
import { checkMembership } from "../utils/daoUtils";

const ListOfDaosPage = () => {
  const address = useAddress();
  const [daos, setDaos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [memberships, setMemberships] = useState({});

  useEffect(() => {
    const loadDAOs = async () => {
      if (!address) return;

      setLoading(true);
      try {
        // Fetch top DAOs based on metric Y
        const daoList = await fetch("/api/daos/top?metric=y").then(r => r.json());
        setDaos(daoList);
      } catch (error) {
        console.error("Error loading DAOs:", error);
      }
      setLoading(false);
    };

    loadDAOs();
  }, [address]);

  const handleScroll = async (daoAddress: string) => {
    if (!address) return;

    // Check membership status for the specific DAO
    const membershipData = await checkMembership(address, daoAddress);
    setMemberships(prev => ({
      ...prev,
      [daoAddress]: membershipData
    }));
  };

  if (loading) return <div>Loading DAOs...</div>;

  return (
    <div className="daos-grid">
      {daos.map((dao) => (
        <DAOCard
          key={dao.address}
          name={dao.name}
          address={dao.address}
          membership={memberships[dao.address]}
          onScroll={() => handleScroll(dao.address)} // Trigger membership check on scroll
        />
      ))}
    </div>
  );
};
**/
//DaoCard.tsx
