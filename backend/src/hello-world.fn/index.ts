export const handler = async () => {
  return {
    body: JSON.stringify(
      {
        message: 'Hello from lambda!',
        timestamp: new Date().toISOString(),
      },
      null,
      2
    ),
    statusCode: 200,
  }
}
