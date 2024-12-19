import { DynamoDB } from 'aws-sdk';

const dynamoDb = new DynamoDB.DocumentClient();
const tableName = process.env.TABLE_NAME || '';

export const handler = async (event: any) => {
  console.log('SQS Event:', JSON.stringify(event));

  const writeRequests = event.Records.map((record: any) => {
    const messageBody = record.body;
    return {
      PutRequest: {
        Item: {
          recordId: record.messageId,
          meesage: messageBody
        }
      }
    };
  });

  const params = {
    RequestItems: {
      [tableName]: writeRequests
    }
  };

  try {
    await dynamoDb.batchWrite(params).promise();
    console.log('Data written to DynamoDB successfully');
  } catch (error) {
    console.error('Error writing to DynamoDB:', error);
    throw new Error('Error processing SQS messages');
  }
};
