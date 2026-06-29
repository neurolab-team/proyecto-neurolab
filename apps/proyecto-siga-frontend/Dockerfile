# Contexto de build: raíz del repo ('.') — ver NOTA #7 del .gitlab-ci.yml
# NO recompila: copia el artefacto .next que produjo el job build:frontend (NOTA #8).
# REQUISITO: next.config.js debe tener `output: 'standalone'` para generar
# .next/standalone con su propio node_modules mínimo (imagen final sin toolchain).
FROM node:22-alpine AS runner

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

WORKDIR /app

RUN apk add --no-cache wget \
    && addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Salida standalone: servidor + node_modules mínimo
COPY apps/proyecto-siga-frontend/.next/standalone/ ./
COPY apps/proyecto-siga-frontend/.next/static/ ./apps/proyecto-siga-frontend/.next/static/
COPY apps/proyecto-siga-frontend/public/ ./apps/proyecto-siga-frontend/public/

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=10s --timeout=5s --retries=3 \
  CMD wget --spider -q http://localhost:3000 || exit 1

CMD ["node", "apps/proyecto-siga-frontend/server.js"]
