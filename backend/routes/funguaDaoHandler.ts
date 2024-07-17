interface IDAODetails {
  daoName: string;
  daoLocation: string;
  targetAudience: string;
  daoTitle: string;
  daoDescription: string;
  daoOverview: string;
  daoImageHash: string;
  multisigAddr: string;
}
interface DaoDetailsToChain {
  daoName: string;
  targetAudience: string;
  daoDescription: string;
  multisigAddr: string;
}
async function funguaDaoHandler() {
  //TODO: Refactor to use url link & body params 
  const daoName = { req.body.daoName };
  const targetAudience = { req.body.targetAudience };
  const daoDescription = { req.body.daoDescription }
  const multisigAddr = { req.body.multisigAddr };
}

