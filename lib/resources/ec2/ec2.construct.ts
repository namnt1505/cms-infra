import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { BaseConstruct } from '../base';
export class Ec2Construct extends BaseConstruct {
  private instance: ec2.Instance
  constructor(scope: Construct, id: string, props: ec2.InstanceProps) {
    super(scope, id);

    this.instance = new ec2.Instance(this, id, props)
  }

  public get(): ec2.Instance {
    return this.instance
  }
}