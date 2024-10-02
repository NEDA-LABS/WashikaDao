// Importing the StrictMode component from React, which helps identify potential issues by activating additional checks and warnings in development mode.
import { StrictMode } from 'react'

// Importing the createRoot function from ReactDOM, used to initialize the rendering of the React app in a specified DOM element.
import { createRoot } from 'react-dom/client'

// Importing the main application component (App) from the App.tsx file, which serves as the root component for the entire application.
import App from './App.tsx'

// Importing various CSS files for styling different parts of the application. 
import './styles/index.css'              
import './styles/headerFooter.css'    
import './styles/homepage.css'         
import './styles/DaoRegistration.css' 
import './styles/DaoProfile.css'     
import './styles/CreateProposal.css' 
import './styles/ViewProposal.css'     
import './styles/JoinPlatform.css'     
import './styles/JifunzeElimu.css'       
import './styles/Owner.css'              
import './styles/Funder.css'             

// Selecting the HTML element with the id of 'root' as the mounting point for the React app.
// The createRoot method is used to create a root element for rendering the React app in the 'root' element.
// The render function takes JSX as input, rendering the <App /> component wrapped in React's StrictMode, which helps detect potential issues.
createRoot(document.getElementById('root')!).render(
  <StrictMode>  
<<<<<<< HEAD
    <App />  {/* The root component of the React app*/}
=======
    <App />   {/*The root component of the React app*/}
>>>>>>> 4d1d419 (add daoDetails frontend api)
  </StrictMode>,
)
