"use strict";var precacheConfig=[["/index.html","7734c267924738beedd40ca1e654c1e6"],["/static/css/main.c47169f0.css","d0c3920c0caccb996a04041cad0e5f22"],["/static/js/0.903643af.chunk.js","2136a63c7e72e39deb4ce013c00c66bd"],["/static/js/1.d2a9677b.chunk.js","94abaefc03a57577168d4b5c62c7faf1"],["/static/js/10.1d7a136e.chunk.js","ff377b6e572151b989ca575ba887d889"],["/static/js/11.7d60596b.chunk.js","839de0d26813bd98724b48aab48440d9"],["/static/js/2.f31d1c46.chunk.js","6167cf756972339af991339c1024b69f"],["/static/js/3.ee77b10e.chunk.js","953801f6253b7d5af9834ead91793e0b"],["/static/js/4.33f81c03.chunk.js","253c9f17fefa85441327ee97ee34daef"],["/static/js/5.94ea7d2e.chunk.js","0938586c730c3f3dd017c6eca7cfc059"],["/static/js/6.7d29d3eb.chunk.js","22b3490bee24ec06ffb538775127ec76"],["/static/js/7.811a29fe.chunk.js","9c16e6b7936ab51041ee09e52317b009"],["/static/js/8.9b100e36.chunk.js","ddf6f1cd23ffdce794d7da5405d9a9ed"],["/static/js/9.8db02e01.chunk.js","7ccb9eb60dbc6038cb91a6c45d30a545"],["/static/js/main.7ed8e64e.js","527f1616ff2aefec3a289e1b04077c26"]],cacheName="sw-precache-v3-sw-precache-webpack-plugin-"+(self.registration?self.registration.scope:""),ignoreUrlParametersMatching=[/^utm_/],addDirectoryIndex=function(e,t){var n=new URL(e);return"/"===n.pathname.slice(-1)&&(n.pathname+=t),n.toString()},cleanResponse=function(t){return t.redirected?("body"in t?Promise.resolve(t.body):t.blob()).then(function(e){return new Response(e,{headers:t.headers,status:t.status,statusText:t.statusText})}):Promise.resolve(t)},createCacheKey=function(e,t,n,a){var c=new URL(e);return a&&c.pathname.match(a)||(c.search+=(c.search?"&":"")+encodeURIComponent(t)+"="+encodeURIComponent(n)),c.toString()},isPathWhitelisted=function(e,t){if(0===e.length)return!0;var n=new URL(t).pathname;return e.some(function(e){return n.match(e)})},stripIgnoredUrlParameters=function(e,n){var t=new URL(e);return t.hash="",t.search=t.search.slice(1).split("&").map(function(e){return e.split("=")}).filter(function(t){return n.every(function(e){return!e.test(t[0])})}).map(function(e){return e.join("=")}).join("&"),t.toString()},hashParamName="_sw-precache",urlsToCacheKeys=new Map(precacheConfig.map(function(e){var t=e[0],n=e[1],a=new URL(t,self.location),c=createCacheKey(a,hashParamName,n,/\.\w{8}\./);return[a.toString(),c]}));function setOfCachedUrls(e){return e.keys().then(function(e){return e.map(function(e){return e.url})}).then(function(e){return new Set(e)})}self.addEventListener("install",function(e){e.waitUntil(caches.open(cacheName).then(function(a){return setOfCachedUrls(a).then(function(n){return Promise.all(Array.from(urlsToCacheKeys.values()).map(function(t){if(!n.has(t)){var e=new Request(t,{credentials:"same-origin"});return fetch(e).then(function(e){if(!e.ok)throw new Error("Request for "+t+" returned a response with status "+e.status);return cleanResponse(e).then(function(e){return a.put(t,e)})})}}))})}).then(function(){return self.skipWaiting()}))}),self.addEventListener("activate",function(e){var n=new Set(urlsToCacheKeys.values());e.waitUntil(caches.open(cacheName).then(function(t){return t.keys().then(function(e){return Promise.all(e.map(function(e){if(!n.has(e.url))return t.delete(e)}))})}).then(function(){return self.clients.claim()}))}),self.addEventListener("fetch",function(t){if("GET"===t.request.method){var e,n=stripIgnoredUrlParameters(t.request.url,ignoreUrlParametersMatching),a="index.html";(e=urlsToCacheKeys.has(n))||(n=addDirectoryIndex(n,a),e=urlsToCacheKeys.has(n));var c="/index.html";!e&&"navigate"===t.request.mode&&isPathWhitelisted(["^(?!\\/__).*"],t.request.url)&&(n=new URL(c,self.location).toString(),e=urlsToCacheKeys.has(n)),e&&t.respondWith(caches.open(cacheName).then(function(e){return e.match(urlsToCacheKeys.get(n)).then(function(e){if(e)return e;throw Error("The cached response that was expected is missing.")})}).catch(function(e){return console.warn('Couldn\'t serve response for "%s" from cache: %O',t.request.url,e),fetch(t.request)}))}});