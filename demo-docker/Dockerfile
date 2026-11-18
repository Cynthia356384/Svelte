# ---------- Etapa 1: compilar la app ----------
FROM node:22-alpine AS build
WORKDIR /app

# Primero solo package*.json: así Docker reutiliza la caché de "npm ci"
# mientras no cambien las dependencias
COPY package*.json ./
RUN npm ci

# Ahora el resto del código y compilamos (genera la carpeta build/)
COPY . .
RUN npm run build

# Quitamos las dependencias de desarrollo para la imagen final
RUN npm prune --omit=dev

# ---------- Etapa 2: imagen final (más ligera) ----------
FROM node:22-alpine
WORKDIR /app

COPY --from=build /app/build ./build
COPY --from=build /app/node_modules ./node_modules
COPY package.json .

ENV NODE_ENV=production
ENV PORT=3000
ENV DATA_DIR=/app/data

EXPOSE 3000

# Docker revisa cada 10 s que la app responda
HEALTHCHECK --interval=10s --timeout=3s --start-period=5s \
  CMD node -e "fetch('http://localhost:3000/salud').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["node", "build"]
