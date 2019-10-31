# BUILDING 
FROM node:lts-alpine AS builder

WORKDIR /app

COPY . ./
COPY docker/config.prod.ts ./src/config/config.prod.ts
RUN apk --no-cache --virtual build-dependencies add \
    python \
    make \
    g++ && \
    # 在国内打开下面一行加速
    npm config set registry https://registry.npm.taobao.org/ && npm config set sass-binary-site http://npm.taobao.org/mirrors/node-sass && \
    npm install && \
    apk del build-dependencies && \
    npm install typescript -g && \
    npm run lint && \
    npm run build

# nginx
FROM nginx:stable-alpine

COPY --from=builder app/build /dolores
RUN rm /etc/nginx/conf.d/default.conf
COPY docker/nginx.conf /etc/nginx/conf.d/