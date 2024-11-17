import { CfnOutput, StackProps } from 'aws-cdk-lib';
import { IVpc, SubnetType, Vpc } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { BaseStack } from '../base/base.stack';

export class VpcStack extends BaseStack {
  public dbVpc: IVpc;
  public appVpc: IVpc;

  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    this.createDbVpc();
  }

  private createDbVpc() {
    this.dbVpc = new Vpc(this, 'DatabaseVpc', {
      availabilityZones: ['ap-southeast-1a', 'ap-southeast-1b'],
      vpcName: `cms-db-vpc-${this.getSuffix()}`,
      subnetConfiguration: [
        {
          name: `cms-db-vpc-private-with-egress`,
          subnetType: SubnetType.PRIVATE_WITH_EGRESS
        },
        {
          name: `cms-db-vpc-public`,
          subnetType: SubnetType.PUBLIC
        }
      ],
      natGateways: 1,
      createInternetGateway: true,
      enableDnsHostnames: true,
      enableDnsSupport: true
    });
  }
}
