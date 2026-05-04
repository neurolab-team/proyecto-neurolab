# Nginx reverse proxy

## Qué hace
- Expone puerto `80`.
- Envía `/api/*` al backend (`backend:6001`).
- Envía `/` al frontend (`frontend:3000`).
- Aplica rate limiting per-IP en login/registro/reenvío.
- Aplica headers de seguridad base.

## Archivos
- `nginx.conf`: configuración global.
- `conf.d/app.conf`: virtual host principal.

## Notas
- Para producción, agregar TLS (`listen 443 ssl`) y HSTS.
- Mantener rate limiting en Nginx **y** backend para defensa en profundidad.
