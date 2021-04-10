import 'source-map-support/register';

import type {ValidatedEventAPIGatewayProxyEvent} from '@libs/apiGateway';
import {formatJSONResponse} from '@libs/apiGateway';
import {middyfy} from '@libs/lambda';

import schema from './schema';

import * as ProductRepository from "@repositories/productRepository"

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try {
    const products = await ProductRepository.getById(event.pathParameters.id);
    return formatJSONResponse(products);
  } catch (e) {
    return formatJSONResponse({"error": e.message}, 400);
  }
}

export const main = middyfy(handler);
