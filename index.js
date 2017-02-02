#!/usr/bin/env node

const watchbot = require('@mapbox/watchbot');
const AWS = require('aws-sdk');
const random = require('random-words');

const region = process.env.StackRegion;
const TopicArn = process.env.WorkTopic;
const Subject = process.env.Subject;
const message = process.env.Message;
const sns = new AWS.SNS({ region });

const words = message.split(' ');
words[Math.floor(Math.random() * (words.length + 1))] = random(1)[0];
const Message = words.join(' ');

const publish = sns.publish({ TopicArn, Subject, Message });

publish.promise()
  .then(() => watchbot.log(`${Subject}: ${Message}`))
  .catch(err => watchbot.log(err));
