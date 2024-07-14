import {CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { VpcConstruct } from './resources/vpc';
import { securityGroupConstruct } from './resources/security-group';
import { Ec2Construct } from './resources/ec2';
import { BaseStack } from './base.stack';

export class CmsInfraStack extends BaseStack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpcCs = new VpcConstruct(this, "vpc", {
      availabilityZones: ['us-east-1a', 'us-east-1b'],
    });
    const vpc = vpcCs.get()

    const sgCs = new securityGroupConstruct(this, "sg", {
      vpc,
    });
    const sgCfn = sgCs.get();

    sgCfn.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(22),
      'allow SSH access from anywhere',
    );

    sgCfn.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(80),
      'allow HTTP traffic from anywhere',
    );

    sgCfn.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(443),
      'allow HTTPS traffic from anywhere',
    );


    const keyPair = ec2.KeyPair.fromKeyPairName(this, 'keypair', 'zenbook_us_east_1')


    const ec2Cs = new Ec2Construct(this, "ec2", {
      machineImage: ec2.MachineImage.latestAmazonLinux2023(),
      vpc,
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T2,
        ec2.InstanceSize.MICRO
      ),
      securityGroup: sgCfn,
      keyPair,
      associatePublicIpAddress: true,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC
      }
    });

    new CfnOutput(this, 'ec2Info', {
      value: ec2Cs.get().instanceId
    })
  }
}
