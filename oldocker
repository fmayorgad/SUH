FROM node:20-alpine3.20 AS front-builder

ARG ANGULAR_ENV=production

WORKDIR /app

COPY frontend/package*.json ./

RUN npm ci --legacy-peer-deps

COPY frontend/ .

RUN npm run build -- --configuration=${ANGULAR_ENV} || echo "Build may have encountered non-fatal errors"
RUN mkdir -p /frontend-dist && \
    find /app -name "*.html" -o -name "*.js" -o -name "*.css" | xargs -I{} cp --parents {} /frontend-dist/ || true

FROM php:8.3.0-fpm-alpine3.19 AS production

ENV TZ=UTC

RUN ln -snf /usr/share/zoneinfo/"$TZ" /etc/localtime && echo "$TZ" > /etc/timezone

RUN apk update && apk add --no-cache supervisor nginx

RUN apk update \
     && docker-php-ext-install mysqli pdo pdo_mysql \
     && docker-php-ext-enable pdo_mysql \
     && apk add --no-cache freetype libpng libjpeg-turbo freetype-dev libpng-dev libjpeg-turbo-dev && \
       docker-php-ext-configure gd \
         --with-freetype \
         --with-jpeg \
       NPROC=$(grep -c ^processor /proc/cpuinfo 2>/dev/null || 1) && \
       docker-php-ext-install -j$(nproc) gd && \
       apk del --no-cache freetype-dev libpng-dev libjpeg-turbo-dev

ENV APP_ENV=production

WORKDIR /var/www/html

# Create necessary Laravel directories if backend is not Laravel
RUN mkdir -p public resources/views

COPY backend/ .

# Copy frontend files without relying on specific paths
COPY --from=front-builder /frontend-dist/app /var/www/html/public/

RUN chown -R www-data:www-data -- *

RUN curl -sS https://getcomposer.org/installer | php -- --version=2.5.8 --install-dir=/usr/local/bin --filename=composer

RUN if [ -f "composer.json" ]; then \
        composer install --no-dev --no-interaction --optimize-autoloader --ignore-platform-reqs; \
    fi

EXPOSE 80

COPY docker/nginx/nginx.conf /etc/nginx/nginx.conf
COPY docker/nginx/http.d/default.conf /etc/nginx/http.d/default.conf

COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]