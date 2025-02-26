
export  function _routeScanRedirectUrlBuilder(_transactionHash: string){
    const routeScanUrl = `https://testnet.routescan.io/tx/${_transactionHash}`;
    return routeScanUrl; 
}