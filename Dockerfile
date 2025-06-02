# Etapa 1: Construcción del frontend
FROM node:18.17.1-alpine3.18 AS front-builder

ARG ANGULAR_ENV=production

WORKDIR /app

COPY frontend/package*.json ./

RUN npm install --force

COPY frontend/ .

RUN npm run build -- --configuration=${ANGULAR_ENV}

# Etapa 2: Construcción del backend
FROM node:18.17.1-alpine3.18 AS backend-builder

WORKDIR /app

COPY backend/package*.json ./

RUN apk add --no-cache g++ make py3-pip && \
    npm install --force

COPY backend/ .

RUN npm run build && \
    npm install --force --omit=dev && \
    npm cache clean --force

# Etapa 3: Imagen de producción
FROM nginx:1.25.0-alpine AS production

# Instalar supervisor
RUN apk add --no-cache supervisor

# Copiar binario de Node.js y configuraciones de Nginx
COPY --from=backend-builder /usr/local/bin/node /usr/local/bin/node
COPY docker/nginx/nginx.conf /etc/nginx/nginx.conf
COPY docker/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf

# Copiar artefactos construidos
COPY --from=backend-builder /app/node_modules ./node_modules
COPY --from=backend-builder /app/dist ./dist
COPY --from=front-builder /app/dist/trinta/browser ./dist/client

# Create signatures directory for file uploads at root level
RUN mkdir -p ../signatures/users && \
    chown -R nginx:nginx ../signatures && \
    chmod -R 755 ../signatures

# Create volume for persistent signature storage
VOLUME ["/signatures"]

# Comando para ejecutar la aplicación
CMD ["node", "dist/src/main.js"]
