#!/bin/sh

set -ex

CUR_DIR=`pwd`
docker pull node:8.11.1-alpine
docker run -itd -v ${CUR_DIR}:/app --name build-dolores -w /app node:8.11.1-alpine sh
docker exec -it build-dolores sh -c "npm install && npm run build"
docker build -t rap2-dolores:1.0.0 .
docker rm -f build-dolores
