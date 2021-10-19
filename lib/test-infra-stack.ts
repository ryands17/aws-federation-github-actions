import * as cdk from '@aws-cdk/core'
import * as ln from '@aws-cdk/aws-lambda-nodejs'
import * as logs from '@aws-cdk/aws-logs'
import * as api from '@aws-cdk/aws-apigatewayv2'
import * as apiIntegrations from '@aws-cdk/aws-apigatewayv2-integrations'

export class TestInfraStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    // Handler for the API
    const handler = new ln.NodejsFunction(this, 'index', {
      entry: 'functions/index.ts',
    })

    new logs.LogGroup(this, 'handlerLogs', {
      logGroupName: `/aws/lambda/${handler.functionName}`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      retention: logs.RetentionDays.ONE_DAY,
    })

    const app = new api.HttpApi(this, 'api', {
      description: 'HTTP API',
      corsPreflight: {
        allowHeaders: ['Content-Type', 'Authorization'],
        allowMethods: [api.CorsHttpMethod.OPTIONS, api.CorsHttpMethod.GET],
        allowOrigins: ['*'],
      },
    })

    app.addRoutes({
      path: '/',
      methods: [api.HttpMethod.GET],
      integration: new apiIntegrations.LambdaProxyIntegration({ handler }),
    })

    new cdk.CfnOutput(this, 'apiUrl', {
      value: app.apiEndpoint,
    })
  }
}
