// src/index.tsx or src/index.js
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store.ts";
import { PersistGate } from 'redux-persist/integration/react'; // Import PersistGate

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
import "./styles/Funder.css";
import "./styles/BlogPage.css";

// Selecting the HTML element with the id of 'root' as the mounting point for the React app.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </StrictMode>
);
