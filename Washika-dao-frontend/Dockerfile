# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install any dependencies
RUN npm install

# Copy the current directory contents into the container at /app
COPY . .

# Build the app
RUN npm run build

# Expose a port
EXPOSE 5173

# Define the command to run your app using serve
CMD [ "npm", "run", "serve" ]
