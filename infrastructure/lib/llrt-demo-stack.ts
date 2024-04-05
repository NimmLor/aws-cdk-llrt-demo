import {
  RemovalPolicy,
  Stack,
  aws_dynamodb,
  type StackProps,
} from 'aws-cdk-lib'
import { type Construct } from 'constructs'
import { LlrtFunction } from './factories/llrt-function'
import { addFunctionUrl } from './utils/add-function-url'
import { Buttonize } from 'buttonize/cdk'
import { createButtonizeAdminApp } from './buttonize-app'

type Props = StackProps & {}

export class LlrtDemoStack extends Stack {
  public constructor(scope: Construct, id: string, props: Props) {
    super(scope, id, props)

    /* BUTTONIZE */

    Buttonize.init(this, {
      apiKey: process.env.BUTTONIZE_API_KEY as string,
    })

    /* BUTTONIZE END */

    const demoTable = new aws_dynamodb.Table(this, 'demo-table', {
      partitionKey: { name: 'PK', type: aws_dynamodb.AttributeType.STRING },
      sortKey: { name: 'SK', type: aws_dynamodb.AttributeType.STRING },
      billingMode: aws_dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
    })

    const helloWorldLambda = LlrtFunction(this, 'hello-world')
    addFunctionUrl(this, 'hello-world', helloWorldLambda)

    const helloWorldLoggerLambda = LlrtFunction(this, 'hello-world-logger')
    addFunctionUrl(this, 'hello-world-logger', helloWorldLoggerLambda)

    const helloWorldTracerLambda = LlrtFunction(this, 'hello-world-tracer')
    addFunctionUrl(this, 'hello-world-tracer', helloWorldTracerLambda)

    const dynamodbToolboxTestLambda = LlrtFunction(this, 'dynamodb-toolbox')
    addFunctionUrl(this, 'dynamodb-toolbox', dynamodbToolboxTestLambda)
    dynamodbToolboxTestLambda.addEnvironment('TABLE_NAME', demoTable.tableName)
    demoTable.grantReadWriteData(dynamodbToolboxTestLambda)

    const dynamodbToolboxTestLambdaNodejs = LlrtFunction(
      this,
      ' dynamodb-toolbox',
      {
        useNodejs: true,
        functionName: `nodejs-demo-dynamodb-toolbox`,
      }
    )
    addFunctionUrl(
      this,
      'dynamodb-toolbox-nodejs',
      dynamodbToolboxTestLambdaNodejs
    )
    dynamodbToolboxTestLambdaNodejs.addEnvironment(
      'TABLE_NAME',
      demoTable.tableName
    )
    demoTable.grantReadWriteData(dynamodbToolboxTestLambdaNodejs)

    createButtonizeAdminApp(this)
  }
}
