# AWS CDK Demo for AWS' LLRT (Low Latency Runtime)

A demo project to showcase the usage of AWS' LLRT (Low Latency Runtime) with AWS CDK.

## Getting started

**Prerequisites**

- Node.js v20.x or later
- Yarn

1. Create a `.env.local` file in the root of the project with the following content:

```properties
CDK_DEFAULT_REGION=eu-central-1
CDK_DEFAULT_ACCOUNT=123456789012

# optional
AWS_DEFAULT_PROFILE=my-profile
```

2. Install dependencies

```properties
yarn
```

3. Deploy your stack

```properties
yarn run deploy
```

### Upgrading LLRT

A script in `./backend/codegen.ts` downloads the latest release of the arm64 llrt runtime and places it in the `./backend/runtime` folder.

```
yarn run codegen
```

### Important

This project contains a sample function using [powertools-lambda-typescript](https://github.com/aws-powertools/powertools-lambda-typescript), however this library is not yet supported for LLRT and does not work right now as of 12.02.2024.

## Authors

- [@lorenz.nimmervoll](https://www.github.com/NimmLor)
