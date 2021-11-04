FROM node:16-alpine


# install dependencies
WORKDIR /app
ADD ./package.json ./package.json
ADD ./server.js ./server.js
RUN npm install


CMD npm run start

