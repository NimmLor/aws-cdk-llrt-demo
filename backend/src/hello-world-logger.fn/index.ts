import { Logger } from '@aws-lambda-powertools/logger'

export const handler = async () => {
  const logger = new Logger()
  logger.info('Hello world')

  return {
    body: JSON.stringify(
      {
        message: 'Hello from lambda! Using the powertools logger!',
        timestamp: new Date().toISOString(),
      },
      null,
      2
    ),
    statusCode: 200,
  }
}
