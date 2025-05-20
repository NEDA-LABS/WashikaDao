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


The frontend interacts with the backend’s API via HTTP requests to the defined routes.

Future iterations of the frontend will integrate with the backend’s blockchain-based enhancements, including smart contract calls for specific actions.

## Current Fixes:

    1. UI Improvement: Enhanced CSS responsiveness for better user experience across different screen sizes and devices.
    
    2. API Integration: Implementation of more API calls to fetch data from the backend

## How to run the application: 
<h4> I will only provide the docker version since it is the only platform independent and most reliable form of maintaing different applications with their runtimes. 
</h4> 

## Docker commands 
<h5> First start by building the application & downloading its dependencies. 
</h5>
    1. <bold>docker build --build-arg VITE_THIRDWEB_CLIENT_ID="api_key_sourced_from_thirdweb" -t wd-frontend .</bold>
<h5> Then run the application. </h5>
    2. <italic>docker run -p 8080:80 wd-frontend</italic>

## I hope you enjoy using the application as much as I enjoyed building it.