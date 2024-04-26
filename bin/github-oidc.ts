#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from '@aws-cdk/core'
import { GithubOidcStack } from '../lib/github-oidc-stack'

const app = new cdk.App()
new GithubOidcStack(app, 'GithubOidcStack', { env: { region: 'us-east-2' } })
