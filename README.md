# RAP2-DOLORES CE version (front-end static build)

[![Build Status](https://travis-ci.org/thx/rap2-dolores.svg?branch=master)](https://travis-ci.org/thx/rap2-dolores)


RAP2 is a new project based on [RAP1](https://github.com/thx/RAP). It has two components:

* rap2-delos: back-end data API server based on Koa + MySQL [link](http://github.com/thx/rap2-delos)
* rap2-dolores: front-end static build based on React [link](http://github.com/thx/rap2-dolores)

### Resources

* [Official Site: rap2.taobao.org](http://rap2.taobao.org)
* DingDing Group ID: 11789704

## Deployment

### development

```sh

npm install

# test cases
npm run test

# will watch & serve automatically
npm run dev

```

### production

```sh

# produce react production package
npm run build

# use serve or nginx to serve the static build directory
serve -s ./build -p 80
```

## Author

* Owner: Alimama FE Team
* Author:
  * Before v2.3: all by [@Nuysoft](https://github.com/nuysoft/), creator of [mockjs](mockjs.com).
  * v2.4+ / CE version: [Bosn](http://github.com/bosn/)(creator of [RAP1](https://github.com/thx/RAP)) [Nuysoft](https://github.com/nuysoft/)
  * We are looking for more and more contributors :)


### Tech Arch

* Front-end (rap2-dolores)
    * React / Redux / Saga / Router
    * Mock.js
    * SASS / Bootstrap 4 beta
    * server: nginx
* Back-end (rap2-delos)
    * Koa
    * Sequelize
    * MySQL
    * Server
    * server: node
