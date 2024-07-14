import { Construct } from "constructs";
import { Fn, StackProps, Stack } from 'aws-cdk-lib';


export abstract class BaseConstruct extends Construct {
  private id: string;
  // private stackSuffix: string;
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id)

    // this.initializeSuffix();
    this.id = id;
  }

  getId() {
    return this.id
  }

  // getSuffix() {
  //   return this.stackSuffix
  // }

  // private initializeSuffix() {
  //   this.stackSuffix = Fn.select(4, Fn.split('-', this.stackId));
  // }


}