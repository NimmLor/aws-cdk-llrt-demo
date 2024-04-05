let coldStart = true
let functionRunningSince = new Date().getTime()

export const handler = async () => {
  let message = 'WARM START! Hello from dynamodb-toolbox.fn'
  if (coldStart) {
    coldStart = false
    message = 'COLD START! Hello from dynamodb-toolbox.fn'
  }

  const response: any = { result: undefined, error: undefined }

  const startTime = new Date().getTime()

  try {
    const testDynamodbToolbox = require('./toolbox-tests').testDynamodbToolbox
    response.result = await testDynamodbToolbox()
  } catch (error) {
    if (error instanceof Error) {
      response.error = error.message
    } else {
      response.error = error
    }
  }

  return {
    body: JSON.stringify(
      {
        message,
        timestamp: new Date().toISOString(),
        functionRunningSince: `${new Date().getTime() - functionRunningSince}ms`,
        executionTime: `${new Date().getTime() - startTime}ms`,
        ...response,
      },
      null,
      2
    ),
    statusCode: 200,
  }
}
