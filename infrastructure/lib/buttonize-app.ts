import { Construct } from 'constructs'
import { LlrtFunction } from './factories/llrt-function'
import { Action, ButtonizeApp, Display, Input } from 'buttonize/cdk'

export const createButtonizeAdminApp = (scope: Construct) => {
  const discountGenerator = LlrtFunction(scope, 'discount-generator')

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
        Display.text('Discount value: {{discount.value}}'),
        Display.text('Discount code: {{discountGenerator.code}}'),
      ],
    })
}
