import { expect as expectCDK, haveResourceLike } from '@aws-cdk/assert'
import * as cdk from '@aws-cdk/core'
import * as context from '../cdk.context.json'
import { GithubOidcStack } from '../lib/github-oidc-stack'

const synthStack = () => {
  const app = new cdk.App({ context: { ...context } })
  return new GithubOidcStack(app, 'GithubOidcStack', {
    env: { region: 'us-east-2' },
  })
}

test('OIDC Provider and IAM role for GitHub Actions are created', () => {
  const stack = synthStack()

  expectCDK(stack).to(
    haveResourceLike('Custom::AWSCDKOpenIdConnectProvider', {
      ClientIDList: [`https://github.com/${context.org}`],
      ThumbprintList: ['a031c46782e6e6c662c2c87c76da9aa62ccabd8e'],
      Url: 'https://token.actions.githubusercontent.com',
    })
  )

  expectCDK(stack).to(
    haveResourceLike('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: 'sts:AssumeRoleWithWebIdentity',
            Condition: {
              StringLike: {
                'token.actions.githubusercontent.com:sub':
                  'repo:ryands17/aws-federation-github-actions:*',
              },
            },
            Effect: 'Allow',
            Principal: {},
          },
        ],
        Version: '2012-10-17',
      },
      ManagedPolicyArns: [
        {
          'Fn::Join': [
            '',
            [
              'arn:',
              {
                Ref: 'AWS::Partition',
              },
              ':iam::aws:policy/PowerUserAccess',
            ],
          ],
        },
      ],
    })
  )
})
