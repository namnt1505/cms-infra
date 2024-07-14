import * as ec2 from 'aws-cdk-lib/aws-ec2';

export const defaultIAM  = () => {
  return new ec2.AmazonLinuxImage({
    generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2023,
  })
}
