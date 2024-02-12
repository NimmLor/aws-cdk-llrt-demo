import { CfnOutput } from 'aws-cdk-lib'
import { Function, FunctionUrlAuthType } from 'aws-cdk-lib/aws-lambda'
import { Construct } from 'constructs'

export const addFunctionUrl = (
  scope: Construct,
  name: string,
  lambda: Function
) => {
  const functionUrl = lambda.addFunctionUrl({
    authType: FunctionUrlAuthType.NONE,
    cors: {
      allowedOrigins: ['*'],
    },
  })

  new CfnOutput(scope, `${name}-Url`, {
    value: functionUrl.url,
  })

  return functionUrl
}
