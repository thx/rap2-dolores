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
    # yarn config set registry https://registry.npm.taobao.org/ && \
    yarn install && \
    apk del build-dependencies && \
    yarn global add typescript && \
    yarn run lint && \
    yarn run build

# nginx
FROM nginx:stable-alpine

COPY --from=builder app/build /dolores
RUN rm /etc/nginx/conf.d/default.conf
COPY docker/nginx.conf /etc/nginx/conf.d/