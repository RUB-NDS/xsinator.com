FROM ubuntu:26.04

RUN apt-get update && apt-get install -y --no-install-recommends \
        nginx libnginx-mod-http-echo \
    && rm -f /etc/nginx/sites-enabled/default \
    && rm -rf /var/lib/apt/lists/*

CMD ["nginx", "-g", "daemon off;"]
