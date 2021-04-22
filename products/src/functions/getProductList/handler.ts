import 'source-map-support/register';

import {formatJSONResponse} from '@libs/apiGateway';
import {middyfy} from '@libs/lambda';

import * as ProductRepository from "@repositories/productRepository"

const handler = async () => {
  const products = await ProductRepository.find();
  return formatJSONResponse(products);
}

export const main = middyfy(handler);
