#!/usr/bin/env node

const AWS = require('aws-sdk');
const rhyme = require('rhyme');

const region = process.env.StackRegion;
const TopicArn = process.env.WorkTopic;
const Subject = process.env.Subject;
const message = process.env.Message;
const sns = new AWS.SNS({ region });


rhyme((rhymer) => {
  const words = message.split(' ');
  const wordToChange = Math.floor(Math.random() * words.length);
  const probabilityOfChange = 0.75;
  console.log("Starting to search rhymer db");
  if (Math.random() <= probabilityOfChange) {
    console.log("Need to rhyme");
    const rhymes = rhymer.rhyme(words[wordToChange]);
    if (rhymes.length > 0) { // only replace if there are rhymes for this word
      console.log("Found a rhyme");
      words[wordToChange] = rhymes[Math.floor(Math.random() * rhymes.length)];
    }
  }
  console.log("Post rhyme");
  const Message = words.join(' ');
  console.log("Message: ", Message);
  const publish = sns.publish({ TopicArn, Subject, Message });
  console.log("Published to SNS");
  publish.promise()
    .then(() => console.log(`${Subject}: ${Message}`))
    .catch(err => console.log(err));
});
