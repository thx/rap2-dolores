FROM nginx:stable-alpine 

ADD ./build/ /usr/share/nginx/html/
ADD default.conf /etc/nginx/conf.d/default.conf
