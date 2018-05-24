FROM ubuntu:16.04

WORKDIR /usr/local/src/ecs-telephone

RUN apt-get update -qq && \
    apt-get install -y curl && \
    curl https://nodejs.org/dist/v8.9.4/node-v8.9.4-linux-x64.tar.gz | tar zxC /usr/local --strip-components=1 && \
    apt-get autoremove -y

COPY package.json ./
RUN npm install --production
RUN npm install -g https://github.com/mapbox/ecs-watchbot/tarball/any-volume

COPY index.js ./
