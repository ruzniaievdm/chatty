FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf ./conf.d/default.conf
# EXPOSE 80
# ENTRYPOINT [ "nginx" ]
# CMD [ "-g", "daemon off;" ]