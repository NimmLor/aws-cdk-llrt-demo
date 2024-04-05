import { App, Environment } from 'aws-cdk-lib'
import { LlrtDemoStack } from '../lib/llrt-demo-stack'

const account = process.env['CDK_DEFAULT_ACCOUNT']
const region = process.env['CDK_DEFAULT_REGION']

const env = {
  account,
  region,
} satisfies Environment

export const app = new App()

new LlrtDemoStack(app, 'LlrtDemoStack', {
  env,
})

app.synth()
