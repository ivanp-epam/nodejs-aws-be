import 'source-map-support/register';

import type {ValidatedEventAPIGatewayProxyEvent} from '@libs/apiGateway';
import {formatJSONResponse} from '@libs/apiGateway';
import {middyfy} from '@libs/lambda';

import schema from './schema';

import {getURLForUpload} from "@services/s3";

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try {
    console.debug(event);
    const fileName = decodeURIComponent(
      event.queryStringParameters.name
    ).trim();

    const url = await getURLForUpload(fileName);

    return formatJSONResponse(url);
  } catch (e) {
    console.error(e);
    return formatJSONResponse({
      error: "Internal server error"
    }, 500);
  }
}

export const main = middyfy(handler);
