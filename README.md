# GitHub Actions via AWS Federation

Created from [this](https://awsteele.com/blog/2021/09/15/aws-federation-comes-to-github-actions.html) blog post.

## Prerequisites

- Node LTS (>= 14 recommended)

- Yarn

## Setup

1. Run `yarn --frozen-lockfile` to install dependencies.

2. Deploy the OIDC stack first using `yarn cdk deploy GithubOidcStack` so that you have the role ARN to add as a GitHub repository secret.

3. Then manually dispatch the workflow for deploying `TestInfraStack` which will then fetch temporary credentials from AWS and run `cdk deploy`.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

- `yarn build` compile typescript to js
- `yarn watch` watch for changes and compile
- `yarn test` perform the jest unit tests
- `yarn cdk deploy` deploy this stack to your default AWS account/region
- `yarn cdk diff` compare deployed stack with current state
- `yarn cdk synth` emits the synthesized CloudFormation template
