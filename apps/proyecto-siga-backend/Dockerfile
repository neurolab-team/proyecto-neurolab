# Contexto de build: raíz del repo ('.') — ver NOTA #7 del .gitlab-ci.yml
# NO recompila: copia el artefacto dist/ que produjo el job build:backend (NOTA #8).
# `nx build ... --configuration=production` genera dist/ con package.json + lockfile podados.
FROM node:22-alpine AS runner

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=6001

WORKDIR /app

RUN apk add --no-cache wget \
    && addgroup --system --gid 1001 appgroup \
    && adduser --system --uid 1001 appuser

# Artefacto ya compilado (incluye package.json/package-lock.json podados por nx)
COPY apps/proyecto-siga-backend/dist/ ./
# Migraciones y schema para que el contenedor pueda servir prisma si lo necesita
COPY prisma/ ./prisma/

RUN npm ci --omit=dev --ignore-scripts 2>/dev/null || npm install --omit=dev --ignore-scripts

USER appuser
EXPOSE 6001

HEALTHCHECK --interval=10s --timeout=5s --retries=3 \
  CMD wget --spider -q http://localhost:6001/api/health || exit 1

CMD ["node", "apps/proyecto-siga-backend/src/main.js"]
