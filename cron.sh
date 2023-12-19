#!/bin/bash

docker compose down
certbot renew
docker compose up -d

