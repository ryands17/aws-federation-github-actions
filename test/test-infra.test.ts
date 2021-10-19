import './helpers'
import { expect as expectCDK, haveResourceLike } from '@aws-cdk/assert'
import * as cdk from '@aws-cdk/core'
import * as context from '../cdk.context.json'
import { TestInfraStack } from '../lib/test-infra-stack'

const synthStack = () => {
  const app = new cdk.App({ context: { ...context } })
  return new TestInfraStack(app, 'TestInfraStack', {
    env: { region: 'us-east-2' },
  })
}

test('Lambda function and corresponding Log Group are created', () => {
  const stack = synthStack()

  expectCDK(stack).to(
    haveResourceLike('AWS::Lambda::Function', {
      Environment: {
        Variables: {
          AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
        },
      },
      Handler: 'index.handler',
      Runtime: 'nodejs14.x',
    })
  )

  expectCDK(stack).to(
    haveResourceLike('AWS::Logs::LogGroup', {
      RetentionInDays: 1,
    })
  )
})

test(`API Gateway and the index endpoint ('/') are created`, () => {
  const stack = synthStack()

  expectCDK(stack).to(
    haveResourceLike('AWS::ApiGatewayV2::Api', {
      CorsConfiguration: {
        AllowHeaders: ['Content-Type', 'Authorization'],
        AllowMethods: ['OPTIONS', 'GET'],
        AllowOrigins: ['*'],
      },
      Description: 'HTTP API',
      Name: 'api',
      ProtocolType: 'HTTP',
    })
  )

  expectCDK(stack).to(
    haveResourceLike('AWS::ApiGatewayV2::Stage', {
      StageName: '$default',
      AutoDeploy: true,
    })
  )

  expectCDK(stack).to(
    haveResourceLike('AWS::ApiGatewayV2::Integration', {
      IntegrationType: 'AWS_PROXY',
      PayloadFormatVersion: '2.0',
    })
  )

  expectCDK(stack).to(
    haveResourceLike('AWS::ApiGatewayV2::Route', {
      RouteKey: 'GET /',
      AuthorizationType: 'NONE',
    })
  )
})
