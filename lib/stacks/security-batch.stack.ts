import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as batch from 'aws-cdk-lib/aws-batch';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as snsSubscriptions from 'aws-cdk-lib/aws-sns-subscriptions';
import { IVpc, Vpc } from 'aws-cdk-lib/aws-ec2';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import path = require('path');
import { Bucket } from 'aws-cdk-lib/aws-s3';

interface BatchJobStackProps extends cdk.StackProps {
  vpc: IVpc;
}

export class BatchJobStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: BatchJobStackProps) {
    super(scope, id, props);

    // SNS Topic
    const topic = new sns.Topic(this, 'MySnsTopic');

    // VPC
    const newVpc = new Vpc(this, 'BatchVPC', {
      maxAzs: 2, // Tùy chỉnh số lượng Availability Zones nếu cần
    });


    // Fargate Compute Environment
    const computeEnvironment = new batch.FargateComputeEnvironment(this, 'FargateComputeEnv', {
      vpc: newVpc,
    });

    // S3 Bucket
    const bucket = new Bucket(this, 'MyReportBucket');



    // Batch Job Queue
    const jobQueue = new batch.JobQueue(this, 'MyJobQueue', {
      computeEnvironments: [
        {
          computeEnvironment,
          order: 1
        }
      ]
    });


    const jobDefinition = new batch.EcsJobDefinition(this, 'MyJob', {
      container: new batch.EcsFargateContainerDefinition(this, 'amazonlinux', {
        image: ecs.ContainerImage.fromRegistry('ghcr.io/zaproxy/zaproxy:stable'),
        memory: cdk.Size.mebibytes(2048),
        cpu: 1,
        command: [
          '/bin/sh', '-c', `
          mkdir -p wrk && \
          zap-baseline.py -t https://www.chat.namnt.net -r report.html && \
          aws s3 cp wrk/report.html s3://${bucket.bucketName}/report.html
          `
        ],

      }),
    });

    // Add permission to write to S3
    const taskRole = jobDefinition.container.executionRole;
    bucket.grantWrite(taskRole);

    const lambdaFunction = new NodejsFunction(this, 'MyLambdaFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'handler',
      entry: 'lib/lambda/helloword/index.ts',
      memorySize: 256,
      timeout: cdk.Duration.seconds(30),
      environment: {
        JOB_DEFINITION: jobDefinition.jobDefinitionArn,
        JOB_QUEUE: jobQueue.jobQueueArn,
      },
    });
    // Grant permissions to Lambda to submit batch jobs
    jobDefinition.grantSubmitJob(lambdaFunction, jobQueue);

    // SNS Subscription
    topic.addSubscription(new snsSubscriptions.LambdaSubscription(lambdaFunction));
  }
}
