#!/usr/bin/env node
import 'source-map-support/register';
import { App } from 'aws-cdk-lib';
import { DatabaseStack } from '../lib/stacks/database.stack';
import { VpcStack } from '../lib/stacks/vpc.stack';
import { SecurityGroupStack } from '../lib/stacks/security-group.stack';

const app = new App();

const vpcStack = new VpcStack(app, 'CmsVPC', {});

const securityGroupStack = new SecurityGroupStack(app, 'CmsSG', {
  dbVpc: vpcStack.getDbVpc(),
});

const dbStack = new DatabaseStack(app, 'CmsDB', {
  vpc: vpcStack.getDbVpc(),
  securityGroup: [securityGroupStack.getDbSecurityGroup()],
});

app.synth();