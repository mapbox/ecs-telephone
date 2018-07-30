# ecs-telephone

A super simplistic example of using ecs-watchbot to spread misinformation. :robot: :telephone:

# What does it do?

Ever played the game "Telephone"? It takes in a message, replaces a word, then sends the new message back to itself to do the task again. Eventually the original message is completely lost. But hey, at least you're learning about ecs-watchbot!

# How to spin it up

### 0. Requirements

**cfn-config**: All of this re asdfquires you to be authenticated with an AWS account. The following steps will use a tool called `cfn-config`, which enables you to deploy services via cloudformation. [Read the docs](https://github.com/mapbox/cfn-config) on how to set up and authenticate your environment.

**an ECS cluster**: ecs-watchbot requires an ECS cluster to work. Learn more about [ECS clusters on AWS](https://aws.amazon.com/ecs/).  

### 1. Clone this repository

```bash
git clone git@github.com:mapbox/ecs-telephone.git
cd ecs-telephone
```

### 2. Create a new stack

```bash
cfn-config create <stack_name>
```

This will create a new stack with all of the resources specified by ecs-watchbot. It will ask for two inputs:

1. GitSha - default to the current local git tree (you can just press enter)
1. Cluster - this needs to be the ECS Cluster ARN where you want the stack to be located - this looks like `arn:aws:ecs:us-east-1:...`.

<details>
<summary>You'll see logs like this...</summary>

<pre></code>~/mapbox/ecs-telephone[master]$ cfn-config create howdy
23:28:03Z us-east-1: creating stack ecs-telephone-howdy
? Saved configurations New configuration
? GitSha: 87bb477ec710c8f7226b364dd465fa1a30227726
? Cluster: arn:aws:ecs:us-east-1:....
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

Logs are viewable through the AWS console via CloudWatch. You can find the LogGroup associated to your service named something like `ecs-telephone-<stack>-us-east-1-...`. Clicking this group will show you a number of LogStreams which are logs from individual tasks run by your watchbot service. Each task will have logs that look something like this:

```
[Thu, 22 Jun 2017 00:30:38 GMT] [watchbot] [68111482-ab11-48b3-b292-6c5dbf22c54e] {"subject":"Attention","message":"make sure to water the plants","receives":"1"}
[Thu, 22 Jun 2017 00:30:52 GMT] [worker] [68111482-ab11-48b3-b292-6c5dbf22c54e] Attention: make sure to locate the plants
```

If you were to stitch the logs together, you'd see your telephone message distort like this (after sending `make sure to water the 🌿` as the original message):
 
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
cfn-config delete <stack>
```
