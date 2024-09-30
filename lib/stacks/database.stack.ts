import { aws_ec2, aws_rds, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { BaseStack } from "../resources/base/base.stack";
import { SecurityGroup } from "aws-cdk-lib/aws-ec2";
import { IVpc } from "aws-cdk-lib/aws-ec2";


interface DatabaseProps extends StackProps {
  vpc: IVpc;
  securityGroup: SecurityGroup[];
}

export class DatabaseStack extends BaseStack {
  private db: aws_rds.DatabaseInstance

  constructor(scope: Construct, id: string, props: DatabaseProps) {
    super(scope, id, props);

    this.db = new aws_rds.DatabaseInstance(this, "Database", {
      engine: aws_rds.DatabaseInstanceEngine.POSTGRES,
      instanceType: aws_ec2.InstanceType.of(aws_ec2.InstanceClass.BURSTABLE4_GRAVITON, aws_ec2.InstanceSize.MICRO),
      allocatedStorage: 20,
      maxAllocatedStorage: 100,
      vpc: props.vpc,
      securityGroups: props.securityGroup,
      vpcSubnets: {
        subnets: [...props.vpc.publicSubnets, ...props.vpc.privateSubnets],
      },
      deletionProtection: false,
      publiclyAccessible: true,
      databaseName: "cms",
      instanceIdentifier: `cms-db-${this.getSuffix()}`,
    });
  }

  public getDbInstance() {
    return this.db;
  }
}