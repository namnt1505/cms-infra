#!/usr/bin/env node
import 'source-map-support/register';
import { App } from 'aws-cdk-lib';
import { DatabaseStack } from '../lib/stacks/database.stack';
import { VpcStack } from '../lib/stacks/vpc.stack';
import { BastionStack } from '../lib/stacks/basion.stack';
import { Port } from 'aws-cdk-lib/aws-ec2';
import { CryptSniperBotStack } from '../lib/stacks/crypt-sniper-bot.stack';

const app = new App({
  autoSynth: true,
  context: {}
});

const vpcStack = new VpcStack(app, 'CmsVPC', {});

const dbStack = new DatabaseStack(app, 'CmsDB', {
  vpc: vpcStack.dbVpc
});

const bastionStack = new BastionStack(app, 'CmsBastion', {
  vpc: vpcStack.dbVpc
});

dbStack.addIngressRule(
  bastionStack.bastionSg,
  Port.tcp(5432),
  'Allow inbound traffic from bastion to DB'
);

const cryptSniperBot = new CryptSniperBotStack(app, 'CryptSniperBot');

app.synth();