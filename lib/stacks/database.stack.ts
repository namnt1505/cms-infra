import { aws_ec2, aws_rds, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { BaseStack } from '../resources/base/base.stack';
import { ISecurityGroup, Peer, Port, SecurityGroup } from 'aws-cdk-lib/aws-ec2';
import { IVpc } from 'aws-cdk-lib/aws-ec2';

interface DatabaseProps extends StackProps {
  vpc: IVpc;
}

export class DatabaseStack extends BaseStack {
  private db: aws_rds.DatabaseInstance;

  private dbSecurityGroup: SecurityGroup;

  constructor(scope: Construct, id: string, props: DatabaseProps) {
    super(scope, id, props);

    const { vpc } = props;
    this.createDbSecurityGroup(vpc);
    this.createDbInstance(vpc, [this.dbSecurityGroup]);
  }

  private createDbInstance(vpc: IVpc, securityGroups: ISecurityGroup[]) {
    this.db = new aws_rds.DatabaseInstance(this, 'Database', {
      engine: aws_rds.DatabaseInstanceEngine.POSTGRES,
      instanceType: aws_ec2.InstanceType.of(
        aws_ec2.InstanceClass.BURSTABLE4_GRAVITON,
        aws_ec2.InstanceSize.MICRO
      ),
      allocatedStorage: 20,
      maxAllocatedStorage: 100,
      vpc: vpc,
      securityGroups: securityGroups,
      vpcSubnets: {
        subnets: [...vpc.privateSubnets]
      },
      deletionProtection: false,
      databaseName: 'cms',
      instanceIdentifier: `cms-db-${this.getSuffix()}`
    });
  }

  private createDbSecurityGroup(vpc: IVpc) {
    this.dbSecurityGroup = new SecurityGroup(this, 'DBSecurityGroup', {
      vpc,
      description: 'Security group for DB',
      allowAllOutbound: true,
      securityGroupName: `cms-db-sg-${this.getSuffix()}`
    });

    this.dbSecurityGroup.addIngressRule(
      Peer.anyIpv4(),
      Port.tcp(5432),
      'Allow public inbound traffic to DB',
      true
    );

    this.dbSecurityGroup.addIngressRule(
      this.dbSecurityGroup,
      Port.tcp(5432),
      'Allow private inbound traffic to DB',
      true
    );
  }

  public getDbInstance() {
    return this.db;
  }

  public getDbSecurityGroup(): SecurityGroup {
    return this.dbSecurityGroup;
  }
}
