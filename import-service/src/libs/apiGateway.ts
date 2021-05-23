import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda"
import type { FromSchema } from "json-schema-to-ts";
import {S3Event} from "aws-lambda/trigger/s3";

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> }
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>
export type S3EventAPIGatewayProxyEvent = Handler<S3Event, APIGatewayProxyResult>

/**
 * @param response
 * @param status
 */
export const formatJSONResponse = (response: any, status: number = 200) => {
  return {
    statusCode: status,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(response)
  }
}
