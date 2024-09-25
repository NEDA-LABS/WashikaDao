import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import JifunzeElimu from './pages/JifunzeElimu';
import DaoRegistration from './pages/DaoRegistration';
import CreateProposal from './pages/CreateProposal';
import JoinPlatform from './pages/JoinPlatform';
import Funder from './pages/Funder';
import DaoProfile from './pages/DaoProfile';
import ViewProposal from './pages/ViewProposal';
import Owner from './pages/Owner';




const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/DaoRegistration" element={<DaoRegistration />} />
                <Route path="/JifunzeElimu" element={<JifunzeElimu />} />
                <Route path="/CreateProposal" element={<CreateProposal />} />
                <Route path="/JoinPlatform" element={<JoinPlatform />} />
                <Route path="/Funder" element={<Funder />} />
                <Route path="/DaoProfile/:daoMultisigAddr" element={<DaoProfile />} />
                <Route path="/DaoProfile" element={<DaoProfile />} />
                <Route path="/ViewProposal" element={<ViewProposal />} />
                <Route path="/Owner" element={<Owner />} />
            </Routes>
        </Router>
    );
};

export default App;
