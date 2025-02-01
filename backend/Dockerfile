# Stage 1: Build dependencies & transpile the code to Javascript
FROM node:lts-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci # Use npm ci for clean installs in the build stage

COPY . .

RUN npm run build # Build the TypeScript code

# Debug: List files in the dist folder to verify the build output
RUN ls -R /app/dist

# Stage 2: Create the final image
FROM node:lts-alpine

WORKDIR /app


# Copy package.json and package-lock.json
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev # Install production dependencies only

# Copy the built JavaScript files from the builder stage
COPY --from=builder /app/dist ./dist

# Copy the node_modules from the builder stage (to avoid re-installing)
COPY --from=builder /app/node_modules ./node_modules

# Copy the TypeORM configuration and migration files
COPY --from=builder /app/dist/data-source.js ./dist/data-source.js
COPY --from=builder /app/src/migrations ./dist/migrations

# Debug: List files in the final image to verify everything is copied correctly
RUN ls -R /app

EXPOSE 8080

ENV NODE_ENV=production

CMD sh -c "npm run migration:apply-curr && node dist/index.js"

