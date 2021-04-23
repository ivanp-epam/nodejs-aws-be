import 'source-map-support/register';

import type {ValidatedEventAPIGatewayProxyEvent} from '@libs/apiGateway';
import {formatJSONResponse} from '@libs/apiGateway';
import {middyfy} from '@libs/lambda';
import schema from './schema';
import {NotFoundError} from "../../errors/notFoundError";
import {getProductRepository} from '@services/repository'

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const ProductRepository = await getProductRepository();

  console.debug(`GetProductById lambda has called with id: ${event.pathParameters.id}`);
  try {
    const products = await ProductRepository.getById(event.pathParameters.id);
    return formatJSONResponse(products);
  } catch (e) {
    if (e instanceof NotFoundError) {
      console.warn(e.message);
      return formatJSONResponse({"error": e.message}, 404);
    }

    console.error(e);
    return formatJSONResponse({"error": "Internal Server Error"}, 500);
  }
}

export const main = middyfy(handler);
