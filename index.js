var aws = require('aws-sdk'); //getting library for aws sdk
var cwl = new aws.CloudWatchLogs(); //instantiating the CloudWatchLogs method
var sns = new aws.SNS({ //instantiating the SNS method in eu-west-1 region
    region:'eu-west-1'
})

exports.handler = function(event, context) {
    var message = JSON.parse(event.Records[0].Sns.Message);
    console.log("message: " + message[0]);
    var alarmName = message.AlarmName;
    var oldState = message.OldStateValue;
    var newState = message.NewStateValue;
    var reason = message.NewStateReason;
    var requestParams = {
        metricName: message.Trigger.MetricName,
        metricNamespace: message.Trigger.Namespace
    };
    cwl.describeMetricFilters(requestParams, function(err, data) {
        if(err) console.log('Error is:', err);
        else {
            console.log('Metric Filter data is:', data);
    	    getLogsAndSendEmail(message, data, context);
        }
    });
};


function getLogsAndSendEmail(message, metricFilterData, context) {
    var timestamp = Date.parse(message.StateChangeTime);
    var offset = message.Trigger.Period * message.Trigger.EvaluationPeriods * 1000;
    var metricFilter = metricFilterData.metricFilters[0];
    var parameters = {
        'logGroupName' : metricFilter.logGroupName,
        'filterPattern' : metricFilter.filterPattern ? metricFilter.filterPattern : "",
         'startTime' : timestamp - offset,
         'endTime' : timestamp
    };
    console.log("Parameters: ", parameters)
    cwl.filterLogEvents(parameters, function (err, data){
        if (err) {
            console.log('Filtering failure:', err);
        } else {
            console.log("===SENDING EMAIL===");
            console.log("data: ", data);
            console.log("data eventName: ", data.events)
            var email = [];
            var events = data.events;
            for (var i in events){
                console.log("event[i][message]: ",events[i]["message"])
                console.log("JSON.parse(event[i][message]):", JSON.parse(events[i]["message"]))
                let message = JSON.parse(events[i]["message"]);
                console.log("events[i][message]: ",message)
                let userIdentity = '     USER IDENTITY: ' + JSON.stringify(message["userIdentity"]) + ',              ';
                let eventName = '      EVENT NAME: ' + JSON.stringify(message['eventName']) + ',                 ';
                let eventTime = '      EVENT TIME: ' + JSON.stringify(message['eventTime']) + ',                ';
                let requestParameters = '      REQUEST PARAMETERS: ' + JSON.stringify(message['requestParameters']) + ',             ';
                let final = '========================================================================================================' + userIdentity + eventName + eventTime + requestParameters + '  ===================================================================================================== ';
                email.push(final);

            }
            var params = {
                'Message': String(email),
                'Subject': message.AlarmName,
                'TopicArn':"arn:aws:sns:eu-west-1:accountNumberHere:TopicName" 
            }
            // 'TopicArn':"arn:aws:sns:eu-west-1:069127586842:security-log-parser"
            console.log("params: ", params);
            sns.publish(params, context.done);
        }
    });
}
