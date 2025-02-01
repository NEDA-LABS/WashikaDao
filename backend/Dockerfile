# Stage 1: Build dependencies & transpile the code to Javascript
FROM node:22.13.1-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci # Use npm ci for clean installs in the build stage

COPY . .

RUN npm run build # Build the TypeScript code

# Stage 2: Create the final image
FROM node:22.13.1-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev # Install production dependencies only

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 8080

CMD ["node", "dist/index.js"] # Start the application

