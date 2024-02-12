import { Tracer } from '@aws-lambda-powertools/tracer'
import { LambdaInterface } from '@aws-lambda-powertools/commons'

const tracer = new Tracer({ serviceName: 'serverlessAirline' })

class Lambda implements LambdaInterface {
  @tracer.captureMethod({ captureResponse: true })
  public async getTimestring(): Promise<string> {
    return new Date().toISOString()
  }

  // @ts-ignore
  @tracer.captureLambdaHandler({ captureResponse: false })
  public handler(_event: unknown, _context: unknown) {
    const timestamp = this.getTimestring()

    return {
      body: JSON.stringify(
        {
          message: 'Hello from powertools traced lambda',
          timestamp,
        },
        null,
        2
      ),
      statusCode: 200,
    }
  }
}

const handlerClass = new Lambda()
export const handler = handlerClass.handler.bind(handlerClass) //
