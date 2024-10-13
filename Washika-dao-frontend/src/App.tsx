// Importing BrowserRouter, Route, and Routes from 'react-router-dom' for setting up client-side routing.
// BrowserRouter is used to wrap the app for routing, and Routes is used to define multiple routes.
// Route defines each individual path and its corresponding component.
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Importing page components to be used for rendering based on the specified routes.
import HomePage from "./pages/HomePage";
import JifunzeElimu from "./pages/JifunzeElimu";
import DaoRegistration from "./pages/DaoRegistration";
import CreateProposal from "./pages/CreateProposal";
import JoinPlatform from "./pages/JoinPlatform";
import Funder from "./pages/Funder";
import DaoProfile from "./pages/DaoProfile";
import ViewProposal from "./pages/ViewProposal";
import Owner from "./pages/Owner";
import TestDao from "./pages/TestDao";
import { ThirdwebProviderContext } from "./ThirdWebProviderContext";


// App component serves as the root of the React application.
// It sets up the Router to manage client-side navigation, allowing users to move between different pages without refreshing the browser.
const App: React.FC = () => {
  return (
    <ThirdwebProviderContext chainId={44787} supportedChainIds={[17000]}>
    <Router>
      {/* Defining routes for the application. Routes is used to declare all the possible routes for the app */}
      <Routes>
        {/* Each Route defines a path in the URL and maps it to a specific component to be rendered */}
        <Route path="/" element={<HomePage />} /> // Root path ('/') loads the
        HomePage component
        <Route path="/DaoRegistration" element={<DaoRegistration />} />
        <Route path="/JifunzeElimu" element={<JifunzeElimu />} />
        <Route path="/CreateProposal/:daoMultiSigAddr" element={<CreateProposal />} />
        <Route path="/JoinPlatform" element={<JoinPlatform />} />
        <Route path="/Funder" element={<Funder />} />
        <Route path="/DaoProfile/:daoMultiSigAddr" element={<DaoProfile />} />
        <Route path="/ViewProposal/:daoMultiSigAddr/:proposalId" element={<ViewProposal />} />
        <Route path="/Owner" element={<Owner />} />
        <Route path="/TestDao" element={<TestDao />} />
      </Routes>
    </Router>
    </ThirdwebProviderContext>
  );
};

export default App;
