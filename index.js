#!/usr/bin/env node

const watchbot = require('@mapbox/watchbot');
const AWS = require('aws-sdk');
const random = require('random-words');

const region = process.env.StackRegion;
const TopicArn = process.env.WorkTopic;
const Subject = process.env.Subject;
const message = process.env.Message;
const sns = new AWS.SNS({ region });
const logger = new watchbot.Logger('worker');

const fs = require('fs');

const words = message.split(' ');
words[Math.floor(Math.random() * (words.length + 1))] = random(1)[0];
const Message = words.join(' ');

logger.log('Let\'s write to the /tmp directory');

fs.writeFileSync('/tmp/file.txt', 'can i write here?');

logger.log('Let\'s write to the /mnt directory');

fs.writeFileSync('/mnt/file.txt', 'can i write here?');

logger.log('Let\'s write to the /usr directory');

fs.writeFileSync('/usr/file.txt', 'can i write here?');

const publish = sns.publish({ TopicArn, Subject, Message });

publish.promise()
  .then(() => logger.log(`${Subject}: ${Message}`))
  .catch(err => logger.log(err));
