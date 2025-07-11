// This file contains a custom hook for fetching DAOs (Decentralized Autonomous Organizations)
// associated with a specific member. It leverages Redux for state management and caches results
// to avoid unnecessary network requests.

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store.js";
import { setUserDaos } from "../../redux/users/userDaosSlice.js";
import { OnchainDao } from "../../utils/Types.js";
import { FullDaoContract } from "../../utils/handlers/Handlers.js";
import { useReadContract } from "thirdweb/react";
import { readContract } from "thirdweb";

/**
 * Interface defining the return structure of the useMemberDaos hook.
 *
 * @property {OnchainDao[]} daos - An array of DAO objects associated with the member.
 * @property {boolean} memberExists - Flag indicating if the member exists in the DAO system.
 */
interface UseMemberDaosResult {
  daos: OnchainDao[];
  memberExists: boolean;
  isLoading: boolean;
}

/**
 * Custom hook that fetches the DAOs for a given member.
 *
 * This hook first checks if the DAOs are already available in the Redux store.
 * If so, it uses the cached data. Otherwise, it makes an API request to fetch the DAOs.
 *
 * It also stores an authentication token in localStorage and updates the Redux store with
 * both the DAO list and the current member's details.
 *
 * @param {string} memberAddr - The blockchain address of the member.
 * @returns {UseMemberDaosResult} An object containing the fetched DAOs and a flag indicating member existence.
 */
export const useMemberDaos = (memberAddr: string): UseMemberDaosResult => {
  const dispatch = useDispatch();
  const storedDaos = useSelector(
    (state: RootState) => state.userDaos.daos
  ) as OnchainDao[];

  // Local state to hold the list of DAOs. Initialize with stored DAOs if available.
  const [daos, setDaos] = useState<OnchainDao[]>(storedDaos || []);
  // Local state to track whether the member exists (based on API response).
  const storedFlag = localStorage.getItem("memberExists");
  const [memberExists, setMemberExists] = useState<boolean>(
    storedFlag === "true"
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const {
    data: allDaosRaw, isLoading: rawLoading
  } = useReadContract({
    contract: FullDaoContract,
    method:
      "function getDaosInPlatformArr() view returns ((string daoName, string daoLocation, string daoObjective, string daoTargetAudience, address daoCreator, bytes32 daoId)[])",
    params: [],
  });

  // useEffect hook triggers whenever the member address or stored DAOs change.
  useEffect(() => {
    // Exit early if there is no member address provided.
    if (!memberAddr || rawLoading) return;

    // If DAOs are already cached in Redux, use them and mark the member as existing.
    // if (storedDaos && storedDaos.length > 0 && storedDaos[0].daoId === allDaosRaw[0]?.daoId) {
    //   setDaos(storedDaos);
    //   setMemberExists(true);
    //   return;
    // }

    const fetchMemberDaos = async () => {
      setIsLoading(true);
      try {
        // for each on-chain DAO, ask if member is in it
        const checks = await Promise.all(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (allDaosRaw as any[]).map(async (d: any) => {
            const isMember = await readContract({
              contract: FullDaoContract,
              method:
                "function isYMemberOfDaoX(bytes32 _daoId, address _userAddress) view returns (bool)",
              params: [d.daoId, memberAddr],
            });

            const isCreator = d.daoCreator.toLowerCase() === memberAddr.toLowerCase();
            if (!isMember && !isCreator) return null;
            return {
              daoName: d.daoName,
              daoLocation: d.daoLocation,
              daoObjective: d.daoObjective,
              daoTargetAudience: d.daoTargetAudience,
              daoCreator: d.daoCreator,
              daoId: d.daoId,
            } as OnchainDao;
          })
        );

        // filter only those where the member exists
        const memberDaos = checks.filter((d): d is OnchainDao => d !== null);
        const exists = memberDaos.length > 0;



        // update local + redux store
        setDaos(memberDaos);
        setMemberExists(exists);
        dispatch(setUserDaos(memberDaos));

        localStorage.setItem("memberExists", exists ? "true" : "false");
      } catch (err) {
        console.error("on-chain member lookup failed", err);
      }finally {
        setIsLoading(false);
      }
    };

    fetchMemberDaos();
  }, [allDaosRaw, dispatch, memberAddr, rawLoading, storedDaos]);

  return { daos, memberExists, isLoading };
};