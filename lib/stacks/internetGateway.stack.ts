import { Construct } from "constructs";
import { BaseStack } from "../resources/base/base.stack";
import { StackProps } from "aws-cdk-lib";

export class InternetGatewayStack extends BaseStack {

  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

  }
}