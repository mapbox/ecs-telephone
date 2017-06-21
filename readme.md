# ecs-telephone

A super simplistic example of using ecs-watchbot to spread misinformation.

# How to spin it up

Assumes you have:

* the Mapbox CLI installed
* authorized your shell with `mbx auth`
* have the AWS CLI installed

#### 1. Clone this repository

```bash
git clone git@github.com:mapbox/ecs-telephone.git
cd ecs-telephone
```

#### 2. Create a new stack

```bash
mbx create <stack_name>
```

This will run through a series of steps related to the cloudformation templates and you'll see an output like the following:

![successfully](https://cloud.githubusercontent.com/assets/1943001/14399522/737c7d38-fdbb-11e5-80fe-e63a0a3a8d65.png)

#### 3. Find your new ARN Topic

Once the stack is created, it will automatically create an ARN topic for you to send SNS messages to. This ARN Topic is part of an SQS queue that was created when you spun up the stack. Any messages in that queue will be handled by your stack thanks to Watchbot.

You can find the SNS topic for your new Nacho stack with the `mbx info` command.

```bash
mbx info <stack_name>
```

It will output a sizeable JSON object. Look for `HookSnsTopic` and you'll see a long string starting with `arn:` like this:

```
arn:aws:sns:us-east-1:234858372212:nacho-test-cheese-Watchbot-1JDQRGTZJBWQG-WatchbotSNS-1EFM8WEBTE6ED
```

That's your SNS Topic. **Copy it**.

#### 4. Send a message
