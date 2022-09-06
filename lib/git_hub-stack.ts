import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Code, Runtime } from 'aws-cdk-lib/aws-lambda';
import { resolve } from 'path';

export class GitHubStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    console.log('resolve -> ', resolve(__dirname, './../lambdas'));

    const helloHandler = new lambda.Function(this, 'helloHandler', {
      runtime: Runtime.NODEJS_16_X,
      code: Code.fromAsset(resolve(__dirname, './../lambdas')),
      handler: 'index.handler'
    });

    const apigwateway = new apigw.LambdaRestApi(this, 'HelloAPIGateway', {
      handler: helloHandler
    });

    


  }
}
