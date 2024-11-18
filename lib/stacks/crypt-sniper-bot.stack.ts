import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as dotenv from 'dotenv';
import { envConfig } from '../const/envConfig';
import { Runtime } from 'aws-cdk-lib/aws-lambda';

dotenv.config();

export class CryptSniperBotStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const telegramBotToken = envConfig.TELEGRAM_CRYPT_SNIPER_BOT_TOKEN;
    const telegramChatId = envConfig.TELEGRAM_CRYPT_CHAT_GROUP_ID;

    const sendMessageFunction = new NodejsFunction(this, 'SendMessageFunction', {
      runtime: Runtime.NODEJS_18_X,
      functionName: 'CryptSniperBotSendMessageFunction',
      environment: {
        TELEGRAM_CRYPT_SNIPER_BOT_TOKEN: telegramBotToken,
        TELEGRAM_CRYPT_CHAT_GROUP_ID: telegramChatId,
      },
      entry: 'lib/lambda/cryptSniperBot/index.ts',
    });

    const rule = new events.Rule(this, 'CryptSniperBotScheduleRule', {
      schedule: events.Schedule.cron({ minute: '0/30', hour: '*' }),
      ruleName: 'CryptSniperBotScheduleRule',
    });

    rule.addTarget(new targets.LambdaFunction(sendMessageFunction));
  }
}
