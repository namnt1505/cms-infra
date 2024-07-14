import {Fn, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';


export class BaseStack extends Stack {
  private stackSuffix: string;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    this.initializeSuffix();
   
  }

  private initializeSuffix() {
    this.stackSuffix = Fn.select(4, Fn.split('-', this.stackId));
  }
}
