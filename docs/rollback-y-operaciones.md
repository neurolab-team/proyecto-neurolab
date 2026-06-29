# Operaciones: Rollback y Criterios de Automatización

> **Arquitectura (Ruta A — sin registry):** el pipeline construye las imágenes en
> el daemon Docker **local** del host (mismo daemon que ejecuta `docker compose`).
> No hay push/pull/login. Las imágenes quedan etiquetadas como
> `neurolab/backend:<sha>` y `neurolab/frontend:<sha>` en el daemon local.
> El proxy inverso se gestiona **fuera** de este compose.

## Procedimiento de Rollback

### Rollback rápido (< 1 minuto)

```bash
cd /opt/neurolab

# 1. Verificar que la imagen del SHA anterior sigue en el daemon local
docker images neurolab/backend
docker images neurolab/frontend

# 2. Exportar el SHA del commit anterior (funcional conocido)
export BACKEND_TAG=<sha_anterior>
export FRONTEND_TAG=<sha_anterior>

# 3. Reiniciar con esa imagen (sin pull: ya está en el daemon local)
docker compose -f docker-compose.prod.yml up -d --remove-orphans

# 4. Verificar
curl -sf http://localhost:6001/api/health && echo "Backend OK"
curl -sf http://localhost:3000 && echo "Frontend OK"
```

### ¿Cómo saber el SHA anterior?

- GitLab → **Deployments → Environments → production** muestra el historial.
- O bien: `git log --oneline -5 main` y usar el penúltimo SHA.
- O bien: `docker images neurolab/backend` lista los SHA disponibles localmente.

### Rollback de migraciones

Si la migración más reciente es la causa del fallo:

1. Crear una migración de reversa manualmente (`prisma migrate diff --to-schema-datamodel <schema_anterior>`)
2. Aplicar con `prisma migrate deploy`
3. Luego hacer rollback de las imágenes como arriba

> **Nota**: `prisma migrate deploy` no soporta `--rollback`. Las migraciones deben ser aditivas y backwards-compatible cuando sea posible.

> **Limitación inherente del rollback (sin compensación de BD).** Volver al SHA
> anterior solo reemplaza el contenedor; el esquema de BD **ya quedó migrado**.
> Si la migración fue destructiva (drop/rename de columna, cambio de tipo), el
> código viejo no funcionará contra la BD nueva y el rollback de imagen NO basta.
> Dos disciplinas para que el rollback sea seguro:
> - **Expand/contract**: separar cada cambio en dos despliegues. Primero "expand"
>   (solo aditivo: nueva columna/tabla, ambos códigos funcionan). Después de
>   estabilizar, "contract" (eliminar lo viejo). Así siempre hay una ventana en
>   la que código nuevo y viejo conviven con el mismo esquema.
> - O **aceptar** que el rollback solo es seguro para cambios sin migración, y
>   para migraciones destructivas planificar una migración de reversa explícita.

---

## Política de Retención de Imágenes

- **Conservar**: los últimos 10 tags SHA por imagen + `latest`
- **Eliminar**: los SHA más antiguos (más allá de los 10 últimos) + capas dangling
- El job `cleanup:images` corre por **schedule** (cron diario recomendado)

El cleanup conserva los `KEEP` SHA más recientes de cada imagen (`neurolab/backend`,
`neurolab/frontend`). La imagen en uso por el deploy actual no se borra porque
`docker rmi` sin `-f` rechaza imágenes con contenedores activos.

Esto garantiza que siempre hay al menos 10 versiones anteriores disponibles para
rollback en el daemon local.

> **Importante:** como no hay registry, las imágenes solo viven en el daemon de
> este host. Si el disco del host se borra, no hay copia remota: el rollback
> depende de que esas imágenes locales sobrevivan. Vigilar el disco es crítico.

---

## Criterios para Automatizar el Deploy (`when: manual` → eliminarlo)

El deploy empieza como `when: manual`. Se puede eliminar la gate manual cuando **todos** estos criterios se cumplen:

| # | Criterio | Cómo verificar |
|---|----------|----------------|
| 1 | Tests automatizados con cobertura > 60% en paths críticos | `nx run-many -t test --coverage` |
| 2 | Al menos 10 deploys manuales exitosos consecutivos | Historial en GitLab Environments |
| 3 | Health check post-deploy funciona sin falsos positivos | 0 verificaciones fallidas que no sean un fallo real |
| 4 | Existe alerta/notificación cuando el deploy falla | Integración GitLab → Slack/email configurada |
| 5 | El equipo aprueba el cambio | Decisión documentada en este archivo |

**Estado actual**: Manual. Fecha objetivo para revisión: cuando se complete la suite de tests (spec pendiente).

---

## Verificación de Versión Desplegada

Tras un deploy, confirmar qué versión corre:

```bash
# Health check del backend (debe incluir versión/SHA)
curl http://localhost:6001/api/health
# Respuesta esperada: {"status":"ok","version":"<sha>"}

# Inspeccionar la imagen del contenedor en ejecución
docker inspect siga-backend --format '{{.Config.Image}}'
# Esperado: neurolab/backend:<sha>
```

> **Requisito**: El endpoint `/api/health` debe retornar el SHA del commit
> (el job `verify` hace `grep` del `$CI_COMMIT_SHORT_SHA` en la respuesta).
> Implementar leyendo una variable `COMMIT_SHA` inyectada en el compose o
> embebida en build time.

---

## Aislamiento de Recursos (misma máquina)

| Riesgo | Mitigación |
|--------|------------|
| Build pesado degrada producción/GitLab | Limitar `concurrent` en `/etc/gitlab-runner/config.toml` a `1` o `2`; limits de memoria en compose |
| Disco lleno tumba GitLab (y borra las imágenes locales) | `cleanup:images` por cron + monitoreo de disco |
| Build cache de Docker crece sin límite | El job `cleanup:images` ejecuta `docker builder prune -af` (el `image prune` solo borra capas dangling, no el build cache) |
| Job malicioso accede a todo | Solo ramas protegidas (`main`) pueden ejecutar `deploy`; variables masked+protected |

---

## Checklist Pre-Producción

- [ ] Variables CI/CD configuradas: `DATABASE_URL`, `SHADOW_DATABASE_URL` (opcional), `MSSQL_SA_PASSWORD`
- [ ] Todas las variables marcadas como **masked** y **protected**
- [ ] `.env.production` existe en `/opt/neurolab/` (no en el repo)
- [ ] Proxy inverso externo configurado y apuntando a `127.0.0.1:6001` (backend) y `127.0.0.1:3000` (frontend)
- [ ] TLS gestionado en el proxy inverso externo
- [ ] Runner registrado con tag `shell` y executor `shell` (comparte el daemon Docker del host)
- [ ] `concurrent = 1` (o `2`) en `/etc/gitlab-runner/config.toml` para que un build pesado no degrade GitLab ni producción
- [ ] Directorio `/opt/neurolab/` con permisos del usuario del runner
- [ ] `docker-compose.prod.yml` presente en `/opt/neurolab/`
- [ ] Scheduled pipeline configurado para `cleanup:images` (diario)
- [ ] Branch `main` protegida (requiere MR aprobado)
