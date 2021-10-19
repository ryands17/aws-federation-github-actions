import { ProxyHandler } from 'aws-lambda'

export const handler: ProxyHandler = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'v2 live', success: true }),
  }
}
