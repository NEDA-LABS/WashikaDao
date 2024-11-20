import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThirdwebProvider } from "thirdweb/react";
import { HelmetProvider } from "react-helmet-async";

// Importing page components
import HomePage from "./pages/HomePage";
import JifunzeElimu from "./pages/JifunzeElimu";
import DaoRegistration from "./pages/DaoRegistration";
import CreateProposal from "./pages/CreateProposal";
import JoinPlatform from "./pages/JoinPlatform";
import Funder from "./pages/Funder";
import PublicDaoProfile from "./pages/PublicDaoProfile";
// import PrivateDaoProfile from "./pages/PrivateDaoProfile";
import ViewProposal from "./pages/ViewProposal";
import Owner from "./pages/Owner";
//Testing functionality components
import TestCreateDao from "./pages/TestCreateDao";
import BlogPage from "./pages/BlogPage";
import TestHoleskyCreateDao from "./pages/TestHoleskyCreateDao";
import TestHoleskyAddMember from "./pages/TestHoleskyAddMember";
import TestHoleskyCreateProposal from "./pages/TestHoleskyCreateProposal";


// App component serves as the root of the React application.
// It sets up the Router to manage client-side navigation.
const App: React.FC = () => {
  // const chain = celoAlfajoresTestnet; // Set up testnet chain

  return (
    // Wrap the entire app in ThirdwebProvider
    <ThirdwebProvider>
      <HelmetProvider>
        <Router>
          <Routes>
            {/* Define routes for the application */}
            <Route path="/" element={<HomePage />} />
            <Route path="/DaoRegistration" element={<DaoRegistration />} />
            <Route path="/JifunzeElimu" element={<JifunzeElimu />} />
            <Route
              path="/CreateProposal/:daoMultiSigAddr"
              element={<CreateProposal />}
            />
            <Route path="/JoinPlatform" element={<JoinPlatform />} />
            <Route path="/Funder/:memberAddr" element={<Funder />} />
            <Route
              path="/PublicDaoProfile/:daoMultiSigAddr"
              element={<PublicDaoProfile />}
            />
            {/* <Route
              path="/DaoProfile/:daoMultiSigAddr"
              element={<PrivateDaoProfile />}
            /> */}
            <Route
              path="/ViewProposal/:daoMultiSigAddr/:proposalId"
              element={<ViewProposal />}
            />
            <Route path="/Owner/:memberAddr" element={<Owner />} />
            <Route path="/blog/:slug" element={<BlogPage />} />
            <Route path="/TestCreateDao" element={<TestCreateDao />} />
            <Route path="/TestHoleskyCreateDao" element={<TestHoleskyCreateDao />} />
          <Route path="/TestHoleskyAddMember" element={<TestHoleskyAddMember />} />
          <Route path="/TestHoleskyCreateProposal" element={<TestHoleskyCreateProposal />} />
        </Routes>
        </Router>
      </HelmetProvider>
    </ThirdwebProvider>
  );
};

export default App;
