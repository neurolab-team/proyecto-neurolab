# Contexto de build: raíz del repo ('.') — ver NOTA #7 del .gitlab-ci.yml
# NO recompila: copia el artefacto dist/ que produjo el job build:backend (NOTA #8).
# `nx build ... --configuration=production` empaqueta el app (bundle) y genera dist/
# con main.js + package.json/pnpm-lock.yaml podados (solo deps externas).
FROM node:22-alpine AS runner

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=6001

WORKDIR /app

RUN apk add --no-cache wget \
    && addgroup --system --gid 1001 appgroup \
    && adduser --system --uid 1001 appuser

# Artefacto ya compilado (bundle + package.json/pnpm-lock.yaml podados por nx).
# Solo quedan externas las deps que no se pueden empaquetar (bcrypt nativo,
# @prisma/client y su adapter, que usan require dinámico): se instalan abajo.
COPY apps/proyecto-siga-backend/dist/ ./
# Migraciones y schema para que el contenedor pueda servir prisma si lo necesita
COPY prisma/ ./prisma/

# nx genera pnpm-lock.yaml (no package-lock.json): se instala con pnpm vía corepack.
RUN corepack enable \
    && pnpm install --prod --frozen-lockfile --ignore-scripts

USER appuser
EXPOSE 6001

HEALTHCHECK --interval=10s --timeout=5s --retries=3 \
  CMD wget --spider -q http://localhost:6001/api/health || exit 1

CMD ["node", "main.js"]
