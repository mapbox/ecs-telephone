#!/usr/bin/env node

const watchbot = require('@mapbox/watchbot');
// const AWS = require('aws-sdk');
const random = require('random-words');

// const region = process.env.StackRegion;
// const TopicArn = process.env.WorkTopic;
const Subject = process.env.Subject;
const message = process.env.Message;
// const sns = new AWS.SNS({ region });

const words = message.split(' ');
words[Math.floor(Math.random() * (words.length + 1))] = random(1)[0];
const Message = words.join(' ');

// const publish = sns.publish({ TopicArn, Subject, Message });

// publish.promise()
Promise.resolve()
  .then(() => watchbot.log(`${Subject}: ${Message}`))
  .catch(err => watchbot.log(err))
  .then(() => new Promise((resolve) => setTimeout(resolve, Math.random() * 1000 * 60 * 3 + 30 * 1000)))
  .then(() => new Promise((resolve) => {
    if (Math.random() > 0.8) {
      setTimeout(resolve, 1000 * 60 * 60 * 2);
    }
  });
