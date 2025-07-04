import { BrowserRouter as Router, Route, Routes } from "react-router";
import { ThirdwebProvider } from "thirdweb/react";
import { HelmetProvider } from "react-helmet-async";

// Importing page components
import Owner from "./pages/Owner.js";
import HomePage from "./pages/HomePage.js";
import JifunzeElimu from "./pages/JifunzeElimu.js";
import DaoRegistration from "./pages/DaoRegistration.js";
import CreateProposal from "./pages/CreateProposal.js";
import JoinPlatform from "./pages/JoinPlatform.js";
import MarketPlace from "./pages/MarketPlace.js";
import DaoProfile from "./pages/DaoProfile.js";
import UpdateDao from "./pages/UpdateDao.js";
import SuperAdmin from "./pages/SuperAdmin.js";
import ViewProposal from "./pages/ViewProposal.js";
import MemberProfile from "./pages/MemberProfile.js";

//Testing functionality components
import BlogPage from "./pages/BlogPage.js";
import TestConnection from "./pages/TestConnection.js";
// App component serves as the root of the React application.
// It sets up the Router to manage client-side navigation.
/**
 * The `App` component serves as the root of the React application.
 * It configures the client-side routing using `react-router-dom` to manage navigation
 * between different pages of the application. The component is wrapped in
 * `ThirdwebProvider` and `HelmetProvider` to provide context and manage side effects.
 *
 * @returns {React.FC} The main application component with defined routes.
 *
 * @component
 * @example
 * return (
 *   <App />
 * )
 *
 * @remarks
 * - The application includes routes for various pages such as HomePage, DaoRegistration,
 *   JifunzeElimu, CreateProposal, and more.
 * - Testing functionality components like TestHoleskyCreateDao and TestConnection are also included.
 * - The component is designed to support dynamic routing with parameters for certain paths.
 */
const App: React.FC = () => {

  return (
    // Wrap the entire app in ThirdwebProvider
    <ThirdwebProvider>
      <HelmetProvider>
        <Router>
          <Routes>
            {/* Define routes for the application */}
            <Route path="/" element={<HomePage />} />
            <Route path="/DaoRegistration" element={<DaoRegistration />} />
            <Route path="/Blogs" element={<JifunzeElimu />} />
            <Route
              path="/CreateProposal"
              element={<CreateProposal />}
            />
            <Route path="/JoinPlatform" element={<JoinPlatform />} />
            <Route path="/TestConnection" element={<TestConnection />} />
            <Route path="/MarketPlace" element={<MarketPlace />} />
            <Route path="/DaoProfile/:multisigAddr" element={<DaoProfile />} />
            <Route path="/SuperAdmin/:multiSigAddr" element={<SuperAdmin />} />
            <Route path="/UpdateDao/:multisigAddr" element={<UpdateDao />} />
            <Route
              path="/ViewProposal/:proposalTitle"
              element={<ViewProposal />}
            />
            <Route path="/MemberProfile/:address" element={<MemberProfile />} />
            <Route path="/Owner/:address" element={<Owner />} />
            <Route path="/blog/:slug" element={<BlogPage />} />
         </Routes>
        </Router>
      </HelmetProvider>
    </ThirdwebProvider>
  );
};

export default App;
