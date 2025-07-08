# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve with http-server
FROM node:20-alpine
WORKDIR /app
RUN npm install -g http-server
COPY --from=builder /app/dist /app/dist
EXPOSE 80
CMD ["http-server", "dist", "-p", "80"]