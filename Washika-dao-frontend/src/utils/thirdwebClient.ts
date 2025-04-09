import { createThirdwebClient } from "thirdweb";

export const client = createThirdwebClient({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    clientId: import.meta.env.VITE_THIRDWEB_CLIENT_ID, // Retrieve the client ID from environment variables.
  });