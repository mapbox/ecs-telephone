FROM ubuntu:16.04

WORKDIR /usr/local/src/ecs-telephone

RUN apt-get update -qq && \
    apt-get install -y wget && \
    apt-get autoremove -y

RUN wget --quiet https://s3.amazonaws.com/mapbox/watchbot/linux/watchbot -O /usr/local/bin/watchbot
RUN chmod +x /usr/local/bin/watchbot

COPY index.sh ./
