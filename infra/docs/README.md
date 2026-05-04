# Infra overview

Esta carpeta centraliza la capa perimetral y operativa de despliegue.

## Estructura
- `infra/nginx/`: reverse proxy, hardening y rate limiting perimetral.
- `infra/docker/`: compose para levantar Nginx + servicios.
- `infra/scripts/`: scripts de validación y operación.
- `infra/docs/`: guías y checklist de seguridad.

## Objetivo
Aplicar defensa en profundidad:
1. **Edge (Nginx)**: proxy, headers, límites por IP.
2. **Aplicación (Express)**: CORS allowlist, helmet, rate limiting por ruta.
