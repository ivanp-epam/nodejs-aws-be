import 'source-map-support/register';

import {formatJSONResponse, S3EventAPIGatewayProxyEvent} from '@libs/apiGateway';
import {middyfy} from '@libs/lambda';

import {S3Event} from "aws-lambda/trigger/s3";
import {parseCsvFromBucketAndMove, S3Params} from "@services/s3";

const handler: S3EventAPIGatewayProxyEvent = async (event: S3Event) => {
  try {
    console.debug('start importFileParser');
    console.debug(event);

    await Promise.all(
      event.Records.map((ev) => {
        const s3Param: S3Params = {
          Bucket: ev.s3.bucket.name,
          Key: ev.s3.object.key
        };
        return parseCsvFromBucketAndMove(s3Param);
      })
    );

    return formatJSONResponse("OK");
  } catch (e) {
    console.error(e);
    return formatJSONResponse("Internal server error", 500);
  }
}

export const main = middyfy(handler);
