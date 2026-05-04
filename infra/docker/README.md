# Docker (Nginx + servicios)

Archivo principal: `docker-compose.nginx.yml`

## Levantar entorno

```bash
docker compose -f infra/docker/docker-compose.nginx.yml up --build
```

## Servicios
- `nginx`: reverse proxy público
- `frontend`: Next.js
- `backend`: Express API

## Requisitos
- `apps/proyecto-siga-backend/.env` presente
- Docker y Docker Compose instalados
