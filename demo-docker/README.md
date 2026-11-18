# Tareas del equipo — SvelteKit + Docker

App de ejemplo para la ADA de Arquitectura de Software: una lista de tareas hecha con
**SvelteKit** y empaquetada en un **contenedor de Docker**.

## Requisitos
- Docker Desktop (Windows/Mac) o Docker Engine (Linux)
- Node.js 22 (solo para correrla sin Docker)

## Opción 1: con Docker Compose (recomendada)
```bash
docker compose up --build
```
Abrir http://localhost:3000

Comandos útiles:
```bash
docker compose ps          # ver el contenedor y si está "healthy"
docker compose logs -f     # ver los logs de la app
docker compose down        # detener y borrar el contenedor (los datos se conservan)
docker compose down -v     # también borra el volumen con los datos
```

## Opción 2: solo con Docker
```bash
docker build -t tareas-svelte .
docker volume create datos-tareas
docker run -d --name tareas -p 3000:3000 \
  -e ORIGIN=http://localhost:3000 \
  -v datos-tareas:/app/data \
  tareas-svelte
```

## Opción 3: sin Docker (modo desarrollo)
```bash
npm install
npm run dev
```

## Archivos clave
| Archivo | Para qué sirve |
|---|---|
| `Dockerfile` | Receta para construir la imagen (2 etapas: compilar y ejecutar) |
| `.dockerignore` | Lo que NO se copia a la imagen (node_modules, build, datos...) |
| `docker-compose.yml` | Levanta la app con puerto, variables de entorno y volumen |
| `vite.config.js` | Usa `@sveltejs/adapter-node` para generar un servidor Node |
| `src/routes/+page.server.js` | Lógica del servidor (cargar, agregar, marcar y borrar tareas) |
| `src/routes/salud/+server.js` | Ruta que usa el HEALTHCHECK de Docker |

## Problemas que encontramos
1. **No se generaba la carpeta `build/`** → el proyecto usaba `adapter-auto`. Lo cambiamos por `adapter-node`.
2. **Error 403 "Cross-site POST form submissions are forbidden"** al usar los formularios → faltaba la variable `ORIGIN`.
3. **Las tareas se borraban al recrear el contenedor** → los datos vivían dentro del contenedor. Usamos un volumen.
4. **La imagen era muy pesada / tardaba mucho** → se copiaba `node_modules`. Agregamos `.dockerignore` y un build de 2 etapas.
5. **"Port is already allocated"** → el puerto 3000 estaba ocupado. Se usa otro puerto: `-p 8080:3000`.
6. **"Cannot find native binding"** al compilar dentro del contenedor → `package-lock.json` generado con otro sistema/npm viejo. Se borra `node_modules` y `package-lock.json` y se corre `npm install` otra vez.
