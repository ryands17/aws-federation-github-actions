import * as cdk from '@aws-cdk/core'
import * as iam from '@aws-cdk/aws-iam'

export class GithubOidcStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const org = this.node.tryGetContext('org')
    const repoName = this.node.tryGetContext('repoName')

    // GitHub OIDC provider
    const ghOidc = new iam.OpenIdConnectProvider(this, 'GitHub', {
      url: 'https://token.actions.githubusercontent.com',
      thumbprints: ['a031c46782e6e6c662c2c87c76da9aa62ccabd8e'],
      clientIds: [`https://github.com/${org}`, 'sts.amazonaws.com'],
    })

    // Role that GitHub actions will assume
    const principal = new iam.FederatedPrincipal(
      ghOidc.openIdConnectProviderArn,
      {
        StringLike: {
          'token.actions.githubusercontent.com:sub': `repo:${org}/${repoName}:*`,
        },
      },
      'sts:AssumeRoleWithWebIdentity'
    )

    const role = new iam.Role(this, 'GitHubActions', {
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('PowerUserAccess'),
      ],
      assumedBy: principal,
    })

    new cdk.CfnOutput(this, 'roleArn', {
      value: role.roleArn,
    })
  }
}
