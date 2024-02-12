import { Stack, type StackProps } from 'aws-cdk-lib'
import { type Construct } from 'constructs'
import { LlrtFunction } from './factories/llrt-function'
import { addFunctionUrl } from './utils/add-function-url'

type Props = StackProps & {}

export class LlrtDemoStack extends Stack {
  public constructor(scope: Construct, id: string, props: Props) {
    super(scope, id, props)

    const helloWorldLambda = LlrtFunction(this, 'hello-world')
    addFunctionUrl(this, 'hello-world', helloWorldLambda)

    const helloWorldLoggerLambda = LlrtFunction(this, 'hello-world-logger')
    addFunctionUrl(this, 'hello-world-logger', helloWorldLoggerLambda)
  }
}
