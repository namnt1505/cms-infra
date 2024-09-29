#!/usr/bin/env node
import 'source-map-support/register';
import { App } from 'aws-cdk-lib';
import { DatabaseStack } from '../lib/stacks/database.stack';
import { VpcStack } from '../lib/stacks/vpc.stack';
import { SecurityGroupStack } from '../lib/stacks/security-group.stack';

const app = new App();

const vpcStack = new VpcStack(app, 'VpcStack', {});

const securityGroupStack = new SecurityGroupStack(app, 'SecurityGroupStack', {
  dbVpc: vpcStack.getDbVpc(),
});

const dbStack = new DatabaseStack(app, 'DatabaseStack', {
  vpc: vpcStack.getDbVpc(),
  securityGroup: [securityGroupStack.getDbSecurityGroup()],
});