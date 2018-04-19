# RAP2-DOLORES CE version (front-end static build)

[![Build Status](https://travis-ci.org/thx/rap2-dolores.svg?branch=master)](https://travis-ci.org/thx/rap2-dolores)


RAP2 is a new project based on [RAP1](https://github.com/thx/RAP). It has two components:
RAP2是在RAP1基础上重做的新项目，它包含两个组件(对应两个Github Repository)。

* rap2-delos: back-end data API server based on Koa + MySQL [link](http://github.com/thx/rap2-delos)
* rap2-dolores: front-end static build based on React [link](http://github.com/thx/rap2-dolores)

* rap2-delos: 后端数据API服务器，基于Koa + MySQL[link](http://github.com/thx/rap2-delos)
* rap2-dolores: 前端静态资源，基于React [link](http://github.com/thx/rap2-dolores)

### Resources

* [Official Site 官网: rap2.taobao.org](http://rap2.taobao.org)
* DingDing Group ID 订订群: 11789704

## Deployment 部署

### development 开发模式

```sh

# initialize 初始化
npm install

# config development mode server API path in /src/config/config.dev.js
# 配置开发模式后端服务器的地址。 /src/config/config.dev.js

# test cases 测试用例
npm run test

# will watch & serve automatically 会自动监视改变后重新编译
npm run dev

```

### production

```sh
# 1. config server API path in /src/config/config.prod.js(production config file)
# 1. 配置后端服务器的地址。 /src/config/config.prod.js(生产模式配置文件)

# 2. produce react production package
# 2. 编译React生产包
npm run build

# 3. use serve or nginx to serve the static build directory
# 3. 用serve命令或nginx服务器路由到编译产出的build文件夹作为静态服务器即可

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
