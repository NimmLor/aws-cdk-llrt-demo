import { Construct } from 'constructs'
// import { LlrtFunction } from './factories/llrt-function'
import { Action, ButtonizeApp, Display, Input } from 'buttonize/cdk'
import { aws_lambda, aws_lambda_nodejs } from 'aws-cdk-lib'
import path from 'path'

export const createButtonizeAdminApp = (scope: Construct) => {
  // const discountGenerator = LlrtFunction(scope, 'discount-generator')

  const discountGenerator = new aws_lambda_nodejs.NodejsFunction(
    scope,
    'discount-generator',
    {
      entry: path.join(
        __dirname,
        '../../backend/src/discount-generator.fn/index.ts'
      ),
      runtime: aws_lambda.Runtime.NODEJS_20_X,
    }
  )

  new ButtonizeApp(scope, 'DemoApp', {
    name: 'Discount code generator',
    description:
      'Select the discount amount and you will get the discount code on the next page.',
  })
    .page('InputPage', {
      body: [
        Display.heading('Generate discount code for customer'),
        Input.select({
          id: 'discount',
          label: 'Discount value',
          options: [
            { label: '30%', value: 30 },
            { label: '60%', value: 60 },
          ],
        }),
        Input.button({
          label: 'Generate discount',
          onClick: Action.aws.lambda.invoke(
            discountGenerator,
            { Payload: { discountValue: '{{discount.value}}' } },
            { id: 'discountGenerator' }
          ),
          onClickFinished: Action.buttonize.app.changePage('DonePage'),
        }),
      ],
    })
    .page('DonePage', {
      body: [
        Display.heading('Last Updated: ' + new Date().toLocaleString()),
        Display.heading('Discount generated'),
        Display.text('Discount value: {{InputPage.discount.value}}'),
        Display.text('Discount code: {{InputPage.discountGenerator.code}}'),
      ],
    })
}
