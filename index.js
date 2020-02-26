#!/usr/bin/env node

const Dyno = require("@mapbox/dyno");
const { default: PQueue } = require("p-queue");
const QUEUE_CAP = 20;
const PAGE_LIMIT = parseInt(process.env.PageLimit, 10);
const ITEM_CAP = Infinity;
const fs = require("fs");
const AWS = require("aws-sdk");
const nodeCleanup = require("node-cleanup");

console.log("PAGELIMIT", PAGE_LIMIT);

class DynamoDB {
  constructor(params = {}) {
    this._dynamoDb = new AWS.DynamoDB({ region: "eu-west-1", params });
  }
  scan(params) {
    return this._dynamoDb.scan(params).promise();
  }
}

class DailyItemsClient {
  /**
   * @param {Object} n - Named parameters.
   * @param {Date} n.extractDate
   * @param {string} n.statisticsTableName
   */
  constructor({ statisticsTableName }) {
    this._queue = new PQueue({
      intervalCap: QUEUE_CAP,
      interval: 1000
    });

    // pollQueueStatus("DailyItemsClient", this._queue);

    const params = {
      TableName: statisticsTableName,
      FilterExpression: "begins_with(#c, :ord)",
      ExpressionAttributeNames: {
        "#c": "collection"
      },
      ExpressionAttributeValues: {
        ":ord": { S: "orders:" }
      },
      Limit: PAGE_LIMIT
    };

    this._dynamoDb = new DynamoDB(params);
  }

  async _queryPage(startKey) {
    return this._queue.add(() => {
      return this._dynamoDb.scan({ ExclusiveStartKey: startKey });
    });
  }

  /**
   * Fetches all relevant Dynamo items from a day.
   * The async iterator yields deserialized DynamoDB items.
   * @returns {AsyncGenerator<DynamoItem>}
   */
  async *fetchItems() {
    console.log("startkeyis " + JSON.stringify(global.startKey));

    let startKey = process.env.STARTKEY
      ? JSON.parse(process.env.STARTKEY)
      : undefined;
    let totalItemsExtracted = 0;
    while (totalItemsExtracted < ITEM_CAP) {
      const response = await this._queryPage(startKey);
      const extractedItems = response.Items.map(item =>
        Dyno.deserialize(JSON.stringify(item))
      );
      totalItemsExtracted += extractedItems.length;

      yield* extractedItems;

      if (response.LastEvaluatedKey) {
        startKey = response.LastEvaluatedKey;
        global.startKey = startKey;
      } else {
        break;
      }
    }
  }
}

let singleton;

function getCoredbBaseClient() {
  if (singleton) {
    return singleton;
  }

  const { coredbRegion, coredbTableName, dynamodbEndpoint } = {
    coredbRegion: "eu-west-1",
    coredbTableName: process.env.CoreDBStack || "coredb-production-main"
  };

  const result = new AWS.DynamoDB.DocumentClient({
    region: coredbRegion,
    params: {
      TableName: coredbTableName
    }
  });

  singleton = result;
  return result;
}

async function foo() {
  let core = getCoredbBaseClient();
  await core
    .delete({
      Key: {
        collection: "orders:bobbysud",
        id: "0c2f5ad3164af1cff590c215fa570c59"
      }
    })
    .promise()
    .then(r => {
      console.log(r)
    })
    .catch(console.err);

  console.log("done");

  // let t = new DailyItemsClient({
  //   statisticsTableName: process.env.CoreDBStack
  // });
  // const queue = new PQueue({ concurrency: 10 });
  // let counter = 0;
  // const s3 = new AWS.S3({ region: "us-east-1" });
  // for await (const z of t.fetchItems()) {
  //   const fullKey = `test/${process.env.StackName}/new/${z.id +
  //     z.collection}.json`;
  //   queue.add(() =>
  //     s3
  //       .upload({
  //         Key: fullKey,
  //         Bucket: `mapbox-billing-eng`,
  //         Body: JSON.stringify(z, null, 2)
  //       })
  //       .promise()
  //   );
  // }

  // await queue.onIdle();
  // console.log("finished");
}

foo();

process.on("unhandledRejection", error => {
  console.error(error);
  console.log(JSON.stringify(global.startKey));
  process.exit(1);
});

nodeCleanup(function(exitCode, signal) {
  console.log("startkeyis " + JSON.stringify(global.startKey));
});
