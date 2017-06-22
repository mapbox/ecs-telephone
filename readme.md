# ecs-telephone

A super simplistic example of using ecs-watchbot to spread misinformation. :robot: :telephone:

# What does it do?

Ever played the game "Telephone"? It takes in a message, replaces a word, then sends the new message back to itself to do the task again. Eventually the original message is completely lost. But hey, at least you're learning about ecs-watchbot!

# How to spin it up

Assumes you have:

* the Mapbox CLI installed
* authorized your shell with `mbx auth`
* have the AWS CLI installed

### 1. Clone this repository

```bash
git clone git@github.com:mapbox/ecs-telephone.git
cd ecs-telephone
```

### 2. Create a new stack

```bash
mbx create <stack_name>
```

This will create a new stack with all of the resources specified by ecs-watchbot. It will ask for two inputs:

1. GitSha - default to the current local git tree (you can just press enter)
1. Cluster - this needs to be the Cluster ARN where you want the stack to be located. You can find the different clusters in the AWS console, but for now stick with the ecs-processing-staging cluster: `arn:aws:ecs:us-east-1:234858372212:cluster/ecs-cluster-processing-staging-Cluster-1CPP4EZCMP3VI`.

<details>
<summary>You'll see logs like this...</summary>

<pre></code>~/mapbox/ecs-telephone[master]$ mbx create howdy
23:28:03Z us-east-1: creating stack ecs-telephone-howdy
? Saved configurations New configuration
? GitSha: 87bb477ec710c8f7226b364dd465fa1a30227726
? Cluster: arn:aws:ecs:us-east-1:234858372212:cluster/ecs-cluster-processing-staging-Cluster-1CPP4EZCMP3VI
? Ready to create the stack? Yes
23:28:15Z us-east-1: CREATE_IN_PROGRESS ecs-telephone-howdy: User Initiated
23:28:17Z us-east-1: CREATE_IN_PROGRESS WatchbotDeadLetterQueue
23:28:19Z us-east-1: CREATE_IN_PROGRESS WatchbotNotificationTopic
23:28:19Z us-east-1: CREATE_IN_PROGRESS WatchbotTaskEventQueue
...
more
...
23:30:29Z us-east-1: CREATE_COMPLETE WatchbotService
23:30:29Z us-east-1: CREATE_COMPLETE WatchbotTaskEventQueuePolicy
23:30:32Z us-east-1: CREATE_COMPLETE ecs-telephone-howdy
</code></pre>

</details>

### 3. Send a message

Each ecs-watchbot stack has a queue that it listens to. You can find this queue in the [SQS dashboard](https://console.aws.amazon.com/sqs/home?region=us-east-1). Search for your stack (called `ecs-telephone-<something>`). A) Select the stack and then B) click the "Queue Actions" dropdown. C) Press "Send a Message" and add a JSON formatted message like this:

```JSON
{
  "Subject": "Your subject",
  "Message": "Your random message to be garbled"
}
```

![abc](https://user-images.githubusercontent.com/1943001/27412508-f6b79500-56a9-11e7-8e03-6c881fe45748.png)

### 4. View logs

```
mbx logs <stack>
```

```
[Thu, 22 Jun 2017 00:30:38 GMT] [watchbot] [68111482-ab11-48b3-b292-6c5dbf22c54e] {"subject":"Attention","message":"make sure to water the plants","receives":"1"}
[Thu, 22 Jun 2017 00:30:52 GMT] [worker] [68111482-ab11-48b3-b292-6c5dbf22c54e] Attention: make sure to locate the plants
```

With the final worker logs looking like this after sending the message `make sure to water the plants`:

```
Attention: make sure to locate the plants
Attention: make sure to locate the plants grass
Attention: material sure to locate the plants grass
Attention: material sure to locate the farther grass
Attention: material sure union locate the farther grass
Attention: material sure union locate pale farther grass
Attention: capital sure union locate pale farther grass
Attention: capital sure union locate brought farther grass
Attention: capital sure union locate brought farther grass central
```

### 5. Delete the stack

This stack continues to send messages back to itself and will never stop until we remove it. Once you've seen the logs, make sure to delete the entire stack!

```
mbx delete <stack>
```
