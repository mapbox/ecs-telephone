#!/usr/bin/env bash

sleepTime=$(echo $((1 + RANDOM % 5)))
echo "I enjoy a good sleep for $sleepTime"
sleep $sleepTime
aws sns publish --topic-arn "$WorkTopic" --subject "$Subject" --message "I enjoy a good sleep" --region "$StackRegion"
