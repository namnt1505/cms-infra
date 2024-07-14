import { Construct } from "constructs";
import { BaseConstruct } from '../base';
import { Vpc, VpcProps } from "aws-cdk-lib/aws-ec2";

export class VpcConstruct extends BaseConstruct {
  private vpc: Vpc;

  constructor(scope: Construct, id: string, props? : VpcProps) {
    super(scope, id);

    this.vpc = new Vpc(this, id, props)
  }

  public get(): Vpc {
    return this.vpc
  }
}
