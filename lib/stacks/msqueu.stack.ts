import * as cdk from 'aws-cdk-lib';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs/lib/construct';
import * as lambda from 'aws-cdk-lib/aws-lambda-nodejs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';

export class MessageQueueStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DynamoDB Table
    const table = new dynamodb.Table(this, 'MyTable', {
      partitionKey: { name: 'recordId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST
    });

    const queue = new sqs.Queue(this, 'MessageQueue', {
      visibilityTimeout: cdk.Duration.seconds(300)
    });

    const sendMessageFunction = new lambda.NodejsFunction(
      this,
      'SendMessageFunction',
      {
        runtime: Runtime.NODEJS_18_X,
        functionName: 'SqsConsumerFunction',
        entry: 'lib/lambda/messageConsumer/index.ts',
        environment: {
          TABLE_NAME: table.tableName
        }
      }
    );

    // Grant Lambda permissions to write to DynamoDB
    table.grantWriteData(sendMessageFunction);

    // Grant Lambda permissions to read messages from SQS
    queue.grantConsumeMessages(sendMessageFunction);

    // Add SQS as an event source for Lambda
    sendMessageFunction.addEventSource(new SqsEventSource(queue));
  }
}
