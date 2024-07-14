import { Construct } from "constructs";
import { BaseConstruct } from '../base';
import { StackProps } from "aws-cdk-lib";
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export class securityGroupConstruct extends BaseConstruct {
  private sg: ec2.SecurityGroup;
  constructor(scope: Construct, id: string, props: ec2.SecurityGroupProps) {
    super(scope, id);
    this.sg = new ec2.SecurityGroup(this, id, props)
  }

  public get(
  ): ec2.SecurityGroup {
    return this.sg;
  }
}