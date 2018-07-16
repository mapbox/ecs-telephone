FROM ubuntu:16.04

WORKDIR /usr/local/src/ecs-telephone

RUN apt-get update -qq && \
    apt-get install -y curl && \
    apt-get install -y wget && \
    curl -s https://s3.amazonaws.com/mapbox/apps/install-node/v2.0.0/run | NV=4.4.2 NP=linux-x64 OD=/usr/local sh && \
    apt-get autoremove -y

RUN wget https://s3.amazonaws.com/watchbot-binaries/linux/v4.9.0/watchbot -O /usr/local/bin/watchbot
RUN chmod +x /usr/local/bin/watchbot

COPY package.json ./
RUN npm install --production

COPY index.js ./

