#!/usr/bin/env node

const watchbot = require('@mapbox/watchbot');
const AWS = require('aws-sdk');
const random = require('random-words');

const region = process.env.StackRegion;
const TopicArn = process.env.WorkTopic;
const Subject = process.env.Subject;
const message = process.env.Message;
const sns = new AWS.SNS({ region });

const fs = require('fs');

const words = message.split(' ');
words[Math.floor(Math.random() * (words.length + 1))] = random(1)[0];
const Message = words.join(' ');

watchbot.log('Let\'s write to the /tmp directory');

fs.write('/tmp/file.txt', 'can i write here?');

watchbot.log('Let\'s write to the /mnt directory');

fs.write('/mnt/file.txt', 'can i write here?');

const publish = sns.publish({ TopicArn, Subject, Message });

publish.promise()
  .then(() => watchbot.log(`${Subject}: ${Message}`))
  .catch(err => watchbot.log(err));
