# cloudwatch-alarm-to-email
Email CloudWatch alarms through the use of SNS and Lambda.

#Required services:
- CloudWatch alarms & Log groups
- 2 X SNS Topics
- Lambda rule to run the NodeJS code

#How to:
1. Set up your CloudWatch log groups and alarms.
2. Set your alarm to trigger a specific SNS topic (SNS topic A).
3. Create a new Lambda function and set it to be triggered by SNS topic A.
4. Have the Lambda function push the results to SNS topic B (your email address should be subscribed to SNS topic B).


Libraries:
async
aws-sdk
base64-js
buffer
crypto-browserify
ieee754
isarray
jmespath
lodash
punycode
querystring
sax
url
xml2js
xmlbuilder
