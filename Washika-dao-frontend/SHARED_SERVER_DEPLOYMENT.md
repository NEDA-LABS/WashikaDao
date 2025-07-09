# Shared Server Deployment Guide

This guide explains how to deploy the WashikaDao frontend on a server with shared resources.

## Server Setup

Your server has the following shared resources:
- **nginx-proxy**: Reverse proxy for SSL termination and routing
- **letsencrypt**: Automatic SSL certificate management
- **shared-postgres**: PostgreSQL database for backend services
- **External networks**: `proxy-tier` and `db-tier`

## Environment Configuration

1. Copy the example environment file:
   ```bash
   cp env.example .env
   ```

2. Edit `.env` with your domain settings:
   ```bash
   # Production domain
   VIRTUAL_HOST=washikadao.xyz
   LETSENCRYPT_HOST=washikadao.xyz
   
   # Staging domain
   VIRTUAL_HOST_STAGING=staging.washikadao.xyz
   LETSENCRYPT_HOST_STAGING=staging.washikadao.xyz
   
   # SSL Certificate email
   LETSENCRYPT_EMAIL=your-email@example.com
   ```

## Deployment

### Manual Deployment

1. Build and start the frontend:
   ```bash
   docker-compose up -d --build
   ```

2. Check container status:
   ```bash
   docker-compose ps
   ```

3. View logs:
   ```bash
   docker-compose logs -f frontend
   ```

### Automated Deployment (GitHub Actions)

The GitHub Actions workflow will automatically:
1. SSH into your server
2. Pull the latest code
3. Build the Docker image
4. Deploy using docker-compose

## Network Configuration

The frontend containers connect to:
- **proxy-tier**: For communication with nginx-proxy and letsencrypt
- **db-tier**: Available for backend services (currently commented out)

## Adding Backend Services

To add a backend service that needs database access:

1. Uncomment the backend service in `docker-compose.yml`
2. Add the `db-tier` network to the backend service
3. Configure the database connection using environment variables:
   ```yaml
   environment:
     - DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@shared-postgres:5432/${POSTGRES_DB}
   networks:
     - proxy-tier
     - db-tier
   ```

## Troubleshooting

### SSL Issues
- Check that `LETSENCRYPT_HOST` matches your domain
- Verify DNS is pointing to your server
- Check letsencrypt logs: `docker logs nginx-proxy-le`

### Network Issues
- Verify external networks exist: `docker network ls`
- Check container connectivity: `docker network inspect proxy-tier`

### Container Issues
- Check container health: `docker-compose ps`
- View logs: `docker-compose logs [service-name]`
- Restart services: `docker-compose restart [service-name]`

## Security Notes

- The Dockerfile runs as a non-root user for security
- Health checks are configured for monitoring
- CORS is enabled for API communication
- Environment variables are used for sensitive configuration 