import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThirdwebProvider } from "thirdweb/react";
import { HelmetProvider } from "react-helmet-async";

// Importing page components
import HomePage from "./pages/HomePage.tsx";
import JifunzeElimu from "./pages/JifunzeElimu.tsx";
import DaoRegistration from "./pages/DaoRegistration.tsx";
import CreateProposal from "./pages/CreateProposal.tsx";
import JoinPlatform from "./pages/JoinPlatform.tsx";
import Funder from "./pages/Funder.tsx";
import PublicDaoProfile from "./pages/PublicDaoProfile.tsx";
// import PrivateDaoProfile from "./pages/PrivateDaoProfile";
import ViewProposal from "./pages/ViewProposal.tsx";
import MemberProfile from "./pages/MemberProfile.tsx";
import Owner from "./pages/Owner.tsx";
//Testing functionality components
import BlogPage from "./pages/BlogPage.tsx";
import TestHoleskyCreateDao from "./pages/TestHoleskyCreateDao.tsx";
import TestHoleskyAddMember from "./pages/TestHoleskyAddMember.tsx";
import TestHoleskyCreateProposal from "./pages/TestHoleskyCreateProposal.tsx";
import TestConnection from "./pages/TestConnection.tsx";
import TestH3WebCreateDao from "./pages/TestH3WebCreateDao.tsx";
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
            <Route path="/TestConnection" element={<TestConnection />} />
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
            <Route path="/MemberProfile" element={<MemberProfile />} />
            <Route path="/Owner/:memberAddr" element={<Owner />} />
            <Route path="/blog/:slug" element={<BlogPage />} />
            <Route path="/TestHoleskyCreateDao" element={<TestHoleskyCreateDao />} />
          <Route path="/TestHoleskyAddMember" element={<TestHoleskyAddMember />} />
          <Route path="/TestHoleskyCreateProposal" element={<TestHoleskyCreateProposal />} />
          <Route path="/TestH3WebCreateDao" element={<TestH3WebCreateDao />} />
        </Routes>
        </Router>
      </HelmetProvider>
    </ThirdwebProvider>
  );
};

export default App;
