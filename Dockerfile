# BUILDING 
FROM node:lts-alpine AS builder
WORKDIR /app
COPY . ./
COPY docker/config.prod.ts ./src/config/config.prod.ts
RUN apk --no-cache --virtual build-dependencies add \
    python \
    make \
    g++ && \
    yarn config set registry https://registry.npm.taobao.org/ && \
    yarn install && \
    apk del build-dependencies && \
    yarn global add typescript && \
    yarn run lint && \
    SERVE_URL=http://localhost:8080 yarn run build

# nginx
FROM nginx:stable-alpine

COPY --from=builder app/build /dolores
RUN rm /etc/nginx/conf.d/default.conf
COPY docker/nginx.conf /etc/nginx/conf.d/