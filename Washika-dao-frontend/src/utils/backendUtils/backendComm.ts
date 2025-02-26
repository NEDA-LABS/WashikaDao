// Key environment variables
//@ts-ignore
export const BASE_BACKEND_ENDPOINT_URL = import.meta.env.VITE_BASE_BACKEND_ENDPOINT_URL;
//@ts-ignore
export const BACKEND_ENDPOINT_ALIVE_CHECKER_URL = import.meta.env.VITE_IS_BACKEND_SERVER_ALIVE_URL; 

//Utility functions to facilitate  backend communication
export async function _isServerAlive(): Promise<boolean>{
    let responseStatusCode: number; 
    try {
  const response = await fetch(
    `${BACKEND_ENDPOINT_ALIVE_CHECKER_URL}`,
     {
    method: "GET", // HTTP method
    headers: {
      "Content-Type": "application/json", // Specify JSON content type
    //allow to send request without cors 
    "Access-Control-Allow-Origin": "_serverCheckerUrl",
    "Access-Control-Allow-Methods": "GET",
    "Access-Control-Allow-Headers": "Content-Type"
    },
  });
  responseStatusCode = response.status;
  if(responseStatusCode === 200){
      return true
  }
  return false;
} catch (error) {
  if (error instanceof TypeError && error.message === 'Failed to fetch') {
    // Network error or server unreachable
    responseStatusCode = 503; // Service Unavailable
  } else if (error instanceof Response) {
    // If the error is a Response object, get its status
    responseStatusCode = error.status;
  } else {
    // For other types of errors, use a generic 500 error
    responseStatusCode = 500;
  }
  console.error('error #%d', responseStatusCode);
  console.error(new Error(`Request Failed or no response please check the error: ${error}`));
  return false;
}
}

