/* eslint-disable no-console */
/* eslint-disable node/no-sync */
import { aws_lambda, Duration } from 'aws-cdk-lib'
import { type Construct } from 'constructs'
import * as path from 'node:path'

type LlrtFunctionProps = Omit<
  aws_lambda.FunctionProps,
  'code' | 'handler' | 'runtime'
> & {
  useNodejs?: boolean
}

/**
 * Factory function to create a Lambda function with LLRT runtime
 * This construct uses reasonable defaults for the Lambda function
 *
 * @param scope - CDK Construct
 * @param functionName - Name of the function in the backend/lambda/src folder
 * @param props - Lambda function properties
 */
export const LlrtFunction = (
  scope: Construct,
  /**
   * Name of the function in the backend/lambda/src folder
   * @example 'hello-world.fn'
   * @example 'hello-world'
   */
  functionName: string,
  props?: LlrtFunctionProps
) => {
  const serviceName = functionName.replace('.fn', '')

  const codePath = path.join(
    import.meta.dirname,
    '../../../backend',
    'dist/src',
    `${serviceName}.fn`.trim()
  )

  const functionProps: aws_lambda.FunctionProps = {
    architecture: aws_lambda.Architecture.ARM_64,
    description: serviceName,
    functionName: `llrt-demo-${serviceName}`,
    handler: 'index.handler',
    memorySize: 1_769,
    timeout: Duration.seconds(30),
    tracing: aws_lambda.Tracing.ACTIVE,
    applicationLogLevel: aws_lambda.ApplicationLogLevel.INFO,
    systemLogLevel: aws_lambda.SystemLogLevel.INFO,
    logFormat: aws_lambda.LogFormat.JSON,
    ...props,
    code: aws_lambda.Code.fromAsset(codePath, {
      exclude: props?.useNodejs ? ['bootstrap'] : [],
    }),
    environment: {
      ...props?.environment,
      POWERTOOLS_SERVICE_NAME: serviceName,
    },
    runtime: props?.useNodejs
      ? aws_lambda.Runtime.NODEJS_20_X
      : aws_lambda.Runtime.PROVIDED_AL2023,
  }

  return new aws_lambda.Function(scope, serviceName, functionProps)
}
