# WashikaDao Frontend Deployment Guide

This guide will help you deploy the WashikaDao frontend using Docker, GitHub Actions, Nginx, and Certbot for SSL. It covers local testing, CI/CD, server setup, and production best practices.

---

## 1. Docker Commands (Local & Server)

### Build the Docker Image Locally
```sh
docker build -t washika-frontend:latest .
```

### Run the Container Locally
```sh
docker run -d --name washika-frontend -p 80:80 washika-frontend:latest
```

### Stop and Remove the Container
```sh
docker stop washika-frontend
docker rm washika-frontend
```

### Tag and Push to DockerHub
```sh
docker tag washika-frontend:latest yourdockerhubuser/washika-frontend:latest
docker push yourdockerhubuser/washika-frontend:latest
```

### Pull and Run on the Server
```sh
docker pull yourdockerhubuser/washika-frontend:latest
docker stop washika-frontend || true
docker rm washika-frontend || true
docker run -d --name washika-frontend -p 80:80 --restart=always yourdockerhubuser/washika-frontend:latest
```

### View Running Containers
```sh
docker ps
```

### View Container Logs
```sh
docker logs washika-frontend
```

### Remove Old Images (Optional Cleanup)
```sh
docker image prune -f
```

---

## 2. Server Setup (Ubuntu Example)

### Install Docker & Docker Compose
```sh
sudo apt update
sudo apt install -y docker.io docker-compose
sudo systemctl enable --now docker
```

### (Optional) Add Your User to Docker Group
```sh
sudo usermod -aG docker $USER
# Log out and back in for this to take effect
```

### Install Nginx
```sh
sudo apt install -y nginx
```

### (Optional) Allow HTTP/HTTPS in Firewall
```sh
sudo ufw allow 'Nginx Full'
```

---

## 3. Certbot SSL (Let's Encrypt)

### Install Certbot
```sh
sudo apt install -y certbot python3-certbot-nginx
```

### Obtain and Install SSL Certificate
```sh
sudo certbot --nginx -d washikadao.xyz
```
- Follow prompts to set up SSL. Certbot will auto-renew.

---

## 4. GitHub Actions CI/CD

- The workflow is in `.github/workflows/deploy.yml`.
- It builds and pushes Docker images to DockerHub, then deploys to your server via SSH.
- Rollback: If the new image fails, it falls back to the last working image.

### Required GitHub Secrets
- `DOCKERHUB_USERNAME` — Your DockerHub username
- `DOCKERHUB_TOKEN` — DockerHub access token/password
- `SERVER_HOST` — Your server's IP or domain
- `SERVER_USER` — SSH username
- `SERVER_SSH_KEY` — Private SSH key (use a GitHub Actions secret, not a password)

---

## 5. Nginx Configuration

- The `nginx.conf` is already set up for SPA fallback and Certbot.
- It will be copied into the container by Docker.

---

## 6. Useful Tips
- To update, just push to `main` — CI/CD will handle the rest.
- To rollback, re-run the deploy job with a previous commit SHA.
- For troubleshooting, check container logs: `docker logs washika-frontend`
- For manual redeploy, repeat the pull/run steps above.

---

## 7. Resources
- [Docker Documentation](https://docs.docker.com/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Certbot Documentation](https://certbot.eff.org/)

---

## 8. CI/CD with Docker Compose & GitHub Actions

### How it works
- On every push to `prod`, GitHub Actions will SSH into your server, pull the latest code, build the Docker image, and restart the stack.
- All services (frontend, nginx-proxy, letsencrypt) are managed by Docker Compose.

### Setup Steps
1. **Ensure your server has Docker and Docker Compose installed.**
2. **Set up SSH key authentication from GitHub Actions to your server.**
   - Generate a new SSH key (if needed):
     ```sh
     ssh-keygen -t ed25519 -C "github-actions-deploy"
     # Add the public key to ~/.ssh/authorized_keys on your server
     # Add the private key as SERVER_SSH_KEY in your repo's GitHub Secrets
     ```
3. **Add these secrets to your GitHub repo:**
   - `SERVER_HOST` — your server's IP or domain
   - `SERVER_USER` — your SSH username
   - `SERVER_SSH_KEY` — your private SSH key (as a secret)
4. **Edit `.github/workflows/deploy.yml` and set the correct path to your project.**
5. **Push to `main` to trigger deployment!**

### Staging Domain Setup
- Add a new service in `docker-compose.yml` for staging (e.g. `frontend-staging`).
- Use a different domain (e.g. `staging.washikadao.xyz`) and set up DNS.
- Example service:
  ```yaml
  frontend-staging:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: washika-frontend-staging
    restart: always
    environment:
      - VIRTUAL_HOST=staging.washikadao.xyz
      - LETSENCRYPT_HOST=staging.washikadao.xyz
      - LETSENCRYPT_EMAIL=clingyking007@gmail.com
    expose:
      - "80"
    depends_on:
      - nginx-proxy
  ```
- Add a DNS A record for `staging.washikadao.xyz` pointing to your server.
- Push to a `staging` branch and update the workflow if you want separate deploys.

### Useful Commands
- `docker compose up -d` — start all services
- `docker compose build frontend` — rebuild the frontend image
- `docker compose logs -f` — view logs
- `docker compose down` — stop all services

---

**Happy shipping!** 
