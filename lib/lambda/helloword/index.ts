import { Handler } from 'aws-cdk-lib/aws-lambda';
import * as AWS from 'aws-sdk';

export const handler: Handler = async () => {
  const jobDefinition = process.env.JOB_DEFINITION!;
  const jobQue = process.env.JOB_QUEUE!;

  const batch = new AWS.Batch();

  const params = {
    jobDefinition: jobDefinition,
    jobName: 'MyBatchJob',
    jobQueue: jobQue,
  };
  await batch.submitJob(params).promise();

  console.log(`Job Definition: ${jobDefinition}`);
  console.log(`Job Queue: ${jobQue}`);
}
