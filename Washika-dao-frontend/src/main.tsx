import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./redux/store.ts";

// Importing various CSS files for styling different parts of the application.
import "./styles/index.css";
import "./styles/headerFooter.css";
import "./styles/homepage.css";
import "./styles/DaoRegistration.css";
import "./styles/DaoProfile.css";
import "./styles/CreateProposal.css";
import "./styles/ViewProposal.css";
import "./styles/JoinPlatform.css";
import "./styles/JifunzeElimu.css";
import "./styles/Owner.css";
import "./styles/MarketPlace.css";
import "./styles/BlogPage.css";
import "./styles/MemberProfile.css";
import "./styles/SuperAdmin.css";

// Selecting the HTML element with the id of 'root' as the mounting point for the React app.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
        <App />
    </Provider>
  </StrictMode>
);
