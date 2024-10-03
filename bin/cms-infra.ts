#!/usr/bin/env node
import 'source-map-support/register';
import { App } from 'aws-cdk-lib';
import { DatabaseStack } from '../lib/stacks/database.stack';
import { VpcStack } from '../lib/stacks/vpc.stack';
import { BastionStack } from '../lib/stacks/basion.stack';
import { Port } from 'aws-cdk-lib/aws-ec2';

const app = new App({
  autoSynth: true,
  context: {}
});

const vpcStack = new VpcStack(app, 'CmsVPC', {});

const dbStack = new DatabaseStack(app, 'CmsDB', {
  vpc: vpcStack.getDbVpc()
});

const bastionStack = new BastionStack(app, 'CmsBastion', {
  vpc: vpcStack.getDbVpc()
});

dbStack
  .getDbSecurityGroup()
  .addIngressRule(
    bastionStack.getBastionSg(),
    Port.POSTGRES,
    'Allow inbound traffic from bastion to DB'
  );
