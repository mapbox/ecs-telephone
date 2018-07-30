FROM ubuntu:16.04

WORKDIR /usr/local/src/ecs-telephone

RUN apt-get update -qq && \
    apt-get install -y curl && \
    apt-get install -y wget && \
    curl https://nodejs.org/dist/v8.10.0/node-v8.10.0-linux-x64.tar.gz | tar zxC /usr/local --strip-components=1 && \
    apt-get autoremove -y

RUN wget --quiet https://s3.amazonaws.com/mapbox/watchbot/linux/watchbot -O /usr/local/bin/watchbot
RUN chmod +x /usr/local/bin/watchbot

COPY package.json ./
RUN npm install --production

COPY index.js ./

