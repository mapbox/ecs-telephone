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

### 3. Find the Queue URL

ecs-watchbot stacks listen for messages in a queue, this queue has a URL for you to send SNS messages to. Any messages in that queue will be handled by your new stack's entrypoint specified in the Dockerfile - eg `CMD ["./index.js"]`. You can find the Queue URL for your new stack with the `mbx info>` command.

```bash
mbx info <stack_name>
```

It will output a sizeable JSON object. Look for `WatchbotQueueUrl` and you'll see a URI that looks something like this:

```
https://sqs.us-east-1.amazonaws.com/234858372212/ecs-telephone-howdy-WatchbotQueue
```

That's your Queue URL. **Copy it**.

### 4. Send a message

Send a message using the AWS CLI `aws sns` command with the URL copied from above

```bash
aws sqs send-message \
  --queue-url https://sqs.us-east-1.amazonaws.com/234858372212/ecs-telephone-howdy-WatchbotQueue \ --message-body "hello how may I help you"
```

### 5. View logs

Now check out the logs
