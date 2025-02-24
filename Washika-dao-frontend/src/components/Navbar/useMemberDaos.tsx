// This file contains a custom hook for fetching DAOs (Decentralized Autonomous Organizations)
// associated with a specific member. It leverages Redux for state management and caches results
// to avoid unnecessary network requests.

import { useState, useEffect } from "react";
import { baseUrl } from "../../utils/backendComm";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { setUserDaos } from "../../redux/users/userDaosSlice";
import { setCurrentUser } from "../../redux/users/userSlice";
import { Dao } from "../../utils/Types";

/**
 * Interface defining the return structure of the useMemberDaos hook.
 *
 * @property {Dao[]} daos - An array of DAO objects associated with the member.
 * @property {boolean} memberExists - Flag indicating if the member exists in the DAO system.
 */
interface UseMemberDaosResult {
  daos: Dao[];
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
  ) as Dao[];

  // Local state to hold the list of DAOs. Initialize with stored DAOs if available.
  const [daos, setDaos] = useState<Dao[]>(storedDaos || []);
  // Local state to track whether the member exists (based on API response).
  const [memberExists, setMemberExists] = useState<boolean>(false);

  // useEffect hook triggers whenever the member address or stored DAOs change.
  useEffect(() => {
    // Exit early if there is no member address provided.
    if (!memberAddr) return;

    // If DAOs are already cached in Redux, use them and mark the member as existing.
    if (storedDaos && storedDaos.length > 0) {
      setDaos(storedDaos);
      setMemberExists(true);
      return;
    }

    // Asynchronous function to fetch DAOs from the backend.
    const fetchDaos = async () => {
      try {
        // Build the API endpoint URL with the member address.
        const response = await fetch(
          `${baseUrl}/Daokit/DaoDetails/GetMemberDaos/?memberAddr=${memberAddr}`
        );
        // Parse the JSON response.
        const data = await response.json();

        // If DAOs are returned from the API, update the local state and Redux store.
        if (data.daos) {
          setDaos(data.daos);
          dispatch(setUserDaos(data.daos));
          // Store the authentication token in localStorage for future requests.
          localStorage.setItem("token", data.authCode);

          // Retrieve member details from the API response.
          const member = data.member;
          if (member) {
            // Dispatch an action to update the current user in Redux.
            dispatch(
              setCurrentUser({
                memberAddr: member.memberAddr,
                firstName: member.firstName,
                lastName: member.lastName,
                email: member.email,
                phoneNumber: member.phoneNumber,
                nationalIdNo: member.nationalIdNo,
              })
            );
            // Set the flag indicating that the member exists.
            setMemberExists(true);
          }
        } else {
          // If no DAOs are found in the response, clear the local DAO list and mark member as non-existent.
          setDaos([]);
          setMemberExists(false);
        }
      } catch (error) {
        // Log any errors that occur during the fetch operation.
        console.error("Failed to fetch DAOs:", error);
      }
    };

    // Call the function to fetch DAOs.
    fetchDaos();
  }, [dispatch, memberAddr, storedDaos]);

  // Return the current list of DAOs and the member existence flag.
  return { daos, memberExists };
};
