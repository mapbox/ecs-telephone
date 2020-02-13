#!/usr/bin/env node

const AWS = require('aws-sdk');
const rhyme = require('rhyme');

const region = process.env.StackRegion;
const TopicArn = process.env.WorkTopic;
const Subject = process.env.Subject;
const message = process.env.Message;
const sns = new AWS.SNS({ region });

