import { Aspects, RemovalPolicy, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { InstanceType, SecurityGroup, Vpc } from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

import { BaseConstruct } from '../base';
import { CfnDBCluster } from 'aws-cdk-lib/aws-rds';

interface SubStackProps extends StackProps {
  vpc: Vpc;
  securityGroup: SecurityGroup;
}

export class AuroraRdsStack extends BaseConstruct {
  public cluster: rds.DatabaseCluster;

  private vpc: Vpc;
  private securityGroup: SecurityGroup;

  constructor(scope: Construct, id: string, props: SubStackProps) {
    super(scope, id);
    this.vpc = props.vpc;
    this.securityGroup = props.securityGroup;
  }

  private subnetPrivate() {
    return this.vpc.selectSubnets({
      subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
    }).subnets;
  }

  private subnetGroup() {
    return new rds.SubnetGroup(this, `subnet-group`, {
      description: 'Aurora subnet group for database',
      vpc: this.vpc,
      vpcSubnets: {
        subnets: this.subnetPrivate(),
      },
    });
  }

  // public createResource() {
  //   this.cluster = new rds.DatabaseCluster(this, 'AuroraDB', {
  //     engine: rds.DatabaseClusterEngine.auroraMysql({
  //       version: rds.AuroraMysqlEngineVersion.VER_3_05_2,
  //     }),
  //     credentials: rds.Credentials.fromGeneratedSecret('admin'),
  //     defaultDatabaseName: `seodash_${this.envConfig.nodeEnv}`,

  //     instanceProps: {
  //       vpc: this.vpc,
  //       publiclyAccessible: false,
  //       instanceType: new InstanceType('serverless'),
  //       securityGroups: [this.securityGroup],
  //       vpcSubnets: {
  //         subnets: this.subnetPrivate(),
  //       },
  //     },
  //     deletionProtection: false,
  //     iamAuthentication: true,
  //     instances: 1,
  //     preferredMaintenanceWindow: 'Sat:16:00-Sat:16:30',
  //     removalPolicy: RemovalPolicy.DESTROY,
  //     subnetGroup: this.subnetGroup(),
  //   });

  //   Aspects.of(this.cluster).add({
  //     visit(node) {
  //       if (node instanceof CfnDBCluster) {
  //         node.serverlessV2ScalingConfiguration = {
  //           minCapacity: 1,
  //           maxCapacity: 3,
  //         };
  //       }
  //     },
  //   });

  //   return this.cluster;
  // }
}
