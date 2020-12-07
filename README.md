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
4. Edit and put the second topic ARN into the lambda script.
5. Upload index.js as a zip file onto the lambda function.
6. Subscribe your email address to SNS topic B.
7. Test.
