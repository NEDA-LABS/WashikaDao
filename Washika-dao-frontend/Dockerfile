# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Add build argument for Vite environment variable
ARG VITE_THIRDWEB_CLIENT_ID
ENV VITE_THIRDWEB_CLIENT_ID=$VITE_THIRDWEB_CLIENT_ID

COPY package*.json ./
# Clean npm cache and use npm ci for reliable install
RUN npm cache clean --force && \
    npm ci --omit=dev
COPY . .
RUN npm run build:prod

# Stage 2: Serve with http-server
FROM node:20-alpine
WORKDIR /app

# Install http-server and create non-root user
RUN npm install -g http-server && \
    addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Copy built application
COPY --from=builder /app/dist /app/dist

# Change ownership to non-root user
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

CMD ["http-server", "dist", "-p", "80", "--cors"]