#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from '@aws-cdk/core'
import { GithubOidcStack } from '../lib/github-oidc-stack'
import { TestInfraStack } from '../lib/test-infra-stack'

const app = new cdk.App()
new GithubOidcStack(app, 'GithubOidcStack', { env: { region: 'us-east-2' } })

new TestInfraStack(app, 'TestInfraStack', {
  env: { account: process.env.AWS_ACCOUNT_ID, region: 'us-east-2' },
})
