import { StackProps } from "aws-cdk-lib";
import { IVpc, SubnetType, Vpc } from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";
import { BaseStack } from "../resources/base/base.stack";

export class VpcStack extends BaseStack {
  private databaseVpc: IVpc;

  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    this.databaseVpc = new Vpc(this, "DatabaseVpc", {
      availabilityZones: ["us-east-1a", "us-east-1b"],
      vpcName: `cms-db-vpc-${this.getSuffix()}`,
      subnetConfiguration: [
        {
          name:`cms-db-vpc-private`,
          subnetType: SubnetType.PRIVATE_WITH_EGRESS
        },
        {
          name:`cms-db-vpc-public`,
          subnetType: SubnetType.PUBLIC
        }
      ]
    });
  }

  public getDbVpc(): IVpc {
    return this.databaseVpc;
  }
}
