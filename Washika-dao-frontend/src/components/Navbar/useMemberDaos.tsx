import { useState, useEffect } from "react";
import { baseUrl } from "../../utils/backendComm";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { setUserDaos } from "../../redux/users/userDaosSlice";
import { Dao } from "../../utils/Types";

interface UseMemberDaosResult {
  daos: Dao[];
  memberExists: boolean;
}

/**
 * Custom hook to fetch DAOs for the current member.
 * It first checks if DAOs are already in Redux. If not, it fetches them.
 *
 * @param memberAddr - The blockchain address of the member.
 * @returns An object with the DAOs.
 */
export function useMemberDaos(memberAddr: string): UseMemberDaosResult {
  const dispatch = useDispatch();
  const storedDaos = useSelector(
    (state: RootState) => state.userDaos.daos
  ) as Dao[];
  const [daos, setDaos] = useState<Dao[]>(storedDaos || []);
  const [memberExists, setMemberExists] = useState<boolean>(false);

  useEffect(() => {
    if (!memberAddr) return;
    // If DAOs are already in Redux, use them.
    if (storedDaos && storedDaos.length > 0) {
      setDaos(storedDaos);
      setMemberExists(true);
      return;
    }
    const fetchDaos = async () => {
      try {
        const response = await fetch(
          `http://${baseUrl}/Daokit/DaoDetails/GetMemberDaos/?memberAddr=${memberAddr}`
        );
        const data = await response.json();
        if (data.daos) {
          setDaos(data.daos);
          dispatch(setUserDaos(data.daos));
        } else {
          setDaos([]);
          setMemberExists(false);
        }
      } catch (error) {
        console.error("Failed to fetch DAOs:", error);
      }
    };

    fetchDaos();
  }, [dispatch, memberAddr, storedDaos]);

  return { daos, memberExists };
};
