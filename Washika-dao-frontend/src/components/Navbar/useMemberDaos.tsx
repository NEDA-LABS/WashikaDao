// This file contains a custom hook for fetching DAOs (Decentralized Autonomous Organizations)
// associated with a specific member. It leverages Redux for state management and caches results
// to avoid unnecessary network requests.

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { setUserDaos } from "../../redux/users/userDaosSlice";
import { OnchainDao } from "../../utils/Types";
import { FullDaoContract } from "../../utils/handlers/Handlers";
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
  const [memberExists, setMemberExists] = useState<boolean>(false);


  const {
    data: allDaosRaw,
  } = useReadContract({
    contract: FullDaoContract,
    method:
      "function getDaosInPlatformArr() view returns ((string daoName, string daoLocation, string daoObjective, string daoTargetAudience, address daoCreator, bytes32 daoId)[])",
    params: [],
  });

  // useEffect hook triggers whenever the member address or stored DAOs change.
  useEffect(() => {
    // Exit early if there is no member address provided.
    if (!memberAddr || !allDaosRaw) return;

    // If DAOs are already cached in Redux, use them and mark the member as existing.
    if (storedDaos && storedDaos.length > 0 && storedDaos[0].daoId === allDaosRaw[0]?.daoId) {
      setDaos(storedDaos);
      setMemberExists(true);
      return;
    }

    const fetchMemberDaos = async () => {
      try {
        // for each on-chain DAO, ask if member is in it
        const checks = await Promise.all(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          allDaosRaw.map(async (d: any) => {
            const isMember = await readContract({
              contract: FullDaoContract,
              method:
                "function isYMemberOfDaoX(bytes32 _daoId, address _userAddress) view returns (bool)",
              params: [d.daoId, memberAddr],
            });
            if (!isMember) return null;
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

        // update local + redux store
        setDaos(memberDaos);
        setMemberExists(memberDaos.length > 0);
        dispatch(setUserDaos(memberDaos));

        // here you could also fetch on-chain member metadata (if you expose it)
        // or fall back to your backend for profile info:
        // dispatch(setCurrentUser({ memberAddr, ... }))
      } catch (err) {
        console.error("on-chain member lookup failed", err);
      }
    };

    fetchMemberDaos();
  }, [
    allDaosRaw,
    dispatch,
    memberAddr,
    storedDaos,
  ]);

  return { daos, memberExists };
};