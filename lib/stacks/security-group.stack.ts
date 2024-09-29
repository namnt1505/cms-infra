import { StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { BaseStack } from "../resources/base/base.stack";
import { IVpc, Peer, Port, SecurityGroup } from "aws-cdk-lib/aws-ec2";

interface SecurityGroupProps extends StackProps {
  dbVpc: IVpc;
} 


export class SecurityGroupStack extends BaseStack {

  private dbSecurityGroup: SecurityGroup;

  constructor(scope: Construct, id: string, props: SecurityGroupProps) {
    super(scope, id, props);

    this.createDbSecurityGroup(props);
  }

  private createDbSecurityGroup(props: SecurityGroupProps) {
    this.dbSecurityGroup = new SecurityGroup(this, "DBSecurityGroup", {
      vpc: props.dbVpc,
      description: "Security group for DB",
      allowAllOutbound: true,
      securityGroupName: `cms-db-sg-${this.getSuffix()}`,
    });

    this.dbSecurityGroup.addIngressRule(
      Peer.anyIpv4(),
      Port.tcp(5432),
      "Allow public inbound traffic to DB",
      true
    );

    this.dbSecurityGroup.addIngressRule(
      this.dbSecurityGroup,
      Port.tcp(5432),
      "Allow private inbound traffic to DB",
      true
    )
  }

  public getDbSecurityGroup(): SecurityGroup {
    return this.dbSecurityGroup;
  }
}
