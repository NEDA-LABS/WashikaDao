import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThirdwebProvider } from "thirdweb/react";

// Importing page components
import HomePage from "./pages/HomePage";
import JifunzeElimu from "./pages/JifunzeElimu";
import DaoRegistration from "./pages/DaoRegistration";
import CreateProposal from "./pages/CreateProposal";
import JoinPlatform from "./pages/JoinPlatform";
import Funder from "./pages/Funder";
import DaoProfile from "./pages/DaoProfile";
import ViewProposal from "./pages/ViewProposal";
import Owner from "./pages/Owner";
import TestCreateDao from "./pages/TestCreateDao";

// App component serves as the root of the React application.
// It sets up the Router to manage client-side navigation.
const App: React.FC = () => {
  // const chain = celoAlfajoresTestnet; // Set up testnet chain

  return (
    // Wrap the entire app in ThirdwebProvider
    <ThirdwebProvider>
      <Router>
        <Routes>
          {/* Define routes for the application */}
          <Route path="/" element={<HomePage />} />
          <Route path="/DaoRegistration" element={<DaoRegistration />} />
          <Route path="/JifunzeElimu" element={<JifunzeElimu />} />
          <Route path="/CreateProposal/:daoMultiSigAddr" element={<CreateProposal />} />
          <Route path="/JoinPlatform" element={<JoinPlatform />} />
          <Route path="/Funder" element={<Funder />} />
          <Route path="/DaoProfile/:daoMultiSigAddr" element={<DaoProfile />} />
          <Route path="/ViewProposal/:daoMultiSigAddr/:proposalId" element={<ViewProposal />} />
          <Route path="/Owner" element={<Owner />} />
          <Route path="/TestCreateDao" element={<TestCreateDao />} />
        </Routes>
      </Router>
    </ThirdwebProvider>
  );
};

export default App;
