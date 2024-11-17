import { Construct } from 'constructs';
import { BaseStack } from '../base/base.stack';
import { StackProps } from 'aws-cdk-lib';
import {
  IKeyPair,
  Instance,
  InstanceClass,
  InstanceProps,
  InstanceSize,
  InstanceType,
  ISecurityGroup,
  IVpc,
  KeyPair,
  Peer,
  Port,
  SecurityGroup,
  SecurityGroupProps,
  SubnetType
} from 'aws-cdk-lib/aws-ec2';
import { defaultIAM } from '../configs';

import * as fs from 'fs';

interface BastionStackProps extends StackProps {
  vpc: IVpc;
}

interface BastionSgProps extends SecurityGroupProps {}

interface BastionInstanceProps extends InstanceProps {}

export class BastionStack extends BaseStack {
  public bastionSg: ISecurityGroup;
  private bastionInstance: Instance;
  private keyPair: IKeyPair;

  constructor(scope: Construct, id: string, props: BastionStackProps) {
    super(scope, id, props);

    const { vpc } = props;
    this.createBastionSg({ vpc });
    this.createKeyPair(
      'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAINxwALENQaSETDxNkvykK7NYyLnSip/5FgJZsrAvXzV/ namnt@Lucas-zenbook'
    );
    this.createBastionInstance({
      vpc,
      instanceType: InstanceType.of(InstanceClass.T2, InstanceSize.MICRO),
      machineImage: defaultIAM(),
      securityGroup: this.bastionSg
    });
  }

  private createBastionSg({ vpc }: BastionSgProps) {
    this.bastionSg = new SecurityGroup(this, 'Bastion-Sg', {
      vpc,
      description: 'Security group for DB',
      allowAllOutbound: true,
      securityGroupName: `cms-bastion-sg-${this.getSuffix()}`
    });

    this.bastionSg.addIngressRule(
      Peer.anyIpv4(),
      Port.SSH,
      'Allow public inbound traffic to Bastion',
      true
    );
  }

  private createKeyPair(publicKeyMaterial?: string) {
    this.keyPair = new KeyPair(this, 'BastionKeyPair', {
      publicKeyMaterial,
      keyPairName: `cms-bastion-keypair-${this.getSuffix()}`
    });
  }

  private createBastionInstance({
    vpc,
    instanceType,
    machineImage,
    securityGroup
  }: BastionInstanceProps) {
    this.bastionInstance = new Instance(this, 'BastionInstance', {
      vpc,
      instanceType,
      machineImage,
      keyPair: this.keyPair,
      instanceName: `cms-bastion-ec2-${this.getSuffix()}`,
      vpcSubnets: { subnetType: SubnetType.PUBLIC },
      associatePublicIpAddress: true,
      securityGroup
    });

    this.bastionInstance.addUserData(
      fs.readFileSync('lib/scripts/user_script.sh', 'utf8')
    );
  }

  public getBastion(): Instance {
    return this.bastionInstance;
  }

  public getBastionSg(): ISecurityGroup {
    return this.bastionSg;
  }
}
