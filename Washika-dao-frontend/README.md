# Frontend Documentation

## ⚙️ Vite Configuration (vite.config.js)

Vite requires minimal configuration, making it easy to set up and run your project.

1. **Install dependencies**: Run the command `npm i` to install and auto-configure dependencies as outlined in the `package.json` file:

2. **Start the development server**: Use the command `npm start` to start a development server with hot module replacement enabled by default:

3. **Access the application**: Once the server is running, open your browser and navigate to: `http://localhost:5173`. This will load the to access the frontend interface.
   
   
## ES6 Module Imports

Files are imported using ES6 syntax, keeping the code modular and organized.


## 🧩 Importing Components 
Components are stored in the ```src/components/``` directory and imported directly into the pages (or other components). This helps maintain a modular and reusable structure, improving maintainability.


## 🎨 Importing Styles and Fonts

Stylesheets ``(*.css)`` are located in the ```src/styles/``` directory.
Fonts are placed in the ```src/fonts/``` directory and are referenced within the CSS files.

This structure ensures separation of concerns between components, styles, and pages, making it easier to manage and scale the React application. 


# Project Structure Overview

src/
├── components/           # Contains reusable React components
├── pages/                # Contains different page components for routing
├── styles/               # CSS files for global and page-specific styling
├── fonts/                # Fonts referenced in your CSS
├── App.tsx               # Main application component
├── Main.tsx              # Entry point for the React app
└── vite.config.js        # Vite configuration file


The frontend interacts with the backend’s API via HTTP requests to the defined routes.

Future iterations of the frontend will integrate with the backend’s blockchain-based enhancements, including smart contract calls for specific actions.

## Current Fixes:

    1. UI Improvement: Enhanced CSS responsiveness for better user experience across different screen sizes and devices.
    
    2. API Integration: Implementation of more API calls to fetch data from the backend