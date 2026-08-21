FROM ubuntu:18.04

RUN apt-get update && apt-get install -y nginx-extras \
    && rm -f /etc/nginx/sites-enabled/default

CMD ["nginx", "-g", "daemon off;"]
