# Shared Server Management Manual

## Overview
This server uses a shared Nginx reverse proxy (with automatic SSL via Let’s Encrypt) and a shared PostgreSQL database (with optional pgAdmin) to host multiple web applications. Each app is deployed independently, but all traffic is routed through the shared proxy. Infrastructure code (proxy, db, etc.) lives in a dedicated infra repo or directory.

---

## Directory Structure

```
/root/server-space/
  ├── shared-resources/                # Infra repo: proxy, db, etc.
  │   ├── docker-compose.shared-resources.yml
  │   ├── nginx/                       # Certs, vhost.d, html (proxy data)
  │   ├── pgdata/                      # Postgres data
  │   ├── pgadmin/                     # pgAdmin data
  │   └── ...
  └── deployed-applications/           # All app repos
      ├── wadao/
      │   └── WashikaDao/
      │       └── Washika-dao-frontend/
      │           └── docker-compose.yml
      └── another-app/
          └── ...
```

---

## Shared Proxy & DB Compose File (shared-resources)

See `docker-compose.shared-resources.yml` for the full stack. It includes:
- **nginx-proxy**: Reverse proxy for all apps (ports 80/443)
- **letsencrypt**: Automatic SSL for all domains
- **postgres**: Shared Postgres DB
- **pgadmin**: DB management UI (port 5050)
- **proxy-tier** and **db-tier**: External Docker networks for app connectivity

---

## App Compose File Example

Each app’s `docker-compose.yml` should:
- Use the `proxy-tier` network for HTTP(S)
- (Optionally) Use the `db-tier` network for database access
- Set the correct `VIRTUAL_HOST` and `LETSENCRYPT_HOST` environment variables

Example:
```yaml
services:
  frontend:
    build: .
    container_name: my-frontend
    environment:
      - VIRTUAL_HOST=mydomain.com
      - LETSENCRYPT_HOST=mydomain.com
      - LETSENCRYPT_EMAIL=clingyking007@gmail.com
    expose:
      - "80"
    networks:
      - proxy-tier
  # backend:
  #   image: my-backend-image
  #   environment:
  #     - DATABASE_URL=postgresql://myuser:mypassword@shared-postgres:5432/mydb
  #   networks:
  #     - proxy-tier
  #     - db-tier
networks:
  proxy-tier:
    external: true
  # db-tier:
  #   external: true
```

---

## How to Deploy

1. **Start the shared proxy/db stack:**
   ```sh
   cd /root/server-space/shared-resources
   docker-compose -f docker-compose.shared-resources.yml up -d
   ```
2. **Deploy an app:**
   ```sh
   cd /root/server-space/deployed-applications/<app>/<subdir>
   docker-compose up -d
   ```
3. **Add new apps:**
   - Add a Compose file as above, join the right networks, set env vars.

---

## Managing the Proxy and DB

- **Proxy logs:**
  ```sh
  cd /root/server-space/shared-resources
  docker-compose -f docker-compose.shared-resources.yml logs nginx-proxy
  docker-compose -f docker-compose.shared-resources.yml logs letsencrypt
  ```
- **DB logs:**
  ```sh
  docker-compose -f docker-compose.shared-resources.yml logs postgres
  docker-compose -f docker-compose.shared-resources.yml logs pgadmin
  ```
- **Restart:**
  ```sh
  docker-compose -f docker-compose.shared-resources.yml restart
  ```

---

## pgAdmin Access
- Visit `http://<your-server-ip>:5050`
- Login: `clingyking007@gmail.com` / `supersecret`
- Register Postgres server: Host `shared-postgres`, User `myuser`, Password `mypassword`

---

## Best Practices
- Keep infra code in a dedicated repo (`shared-resources`)
- Use `.env` files for secrets
- Document new domains, apps, and DBs
- Back up `nginx/certs`, `pgdata`, and `pgadmin` regularly

---

## Security
- Only expose ports 80/443 (proxy) and 5050 (pgAdmin, restrict by firewall if needed)
- All app/db containers should only be accessible via Docker networks

---

## Contact
- [Add your team’s contact info here] 