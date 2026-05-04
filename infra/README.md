# Infra

Implementación de infraestructura y hardening para proyecto SIGA.

## Inicio rápido

1. Configura variables de entorno en backend:
   - `CORS_ORIGINS=https://tu-frontend.com,https://staging-frontend.com`
2. Levanta servicios con compose:

```bash
docker compose -f infra/docker/docker-compose.nginx.yml up --build
```

3. Valida configuración de Nginx:

```bash
docker exec -it siga-nginx nginx -t
```

## Archivos clave
- `infra/nginx/nginx.conf`
- `infra/nginx/conf.d/app.conf`
- `infra/docker/docker-compose.nginx.yml`
- `infra/docs/security-checklist.md`
