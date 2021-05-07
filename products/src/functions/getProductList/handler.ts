import 'source-map-support/register';

import {formatJSONResponse} from '@libs/apiGateway';
import {middyfy} from '@libs/lambda';
import {getProductRepository} from '@services/repository'

const handler = async () => {
  const ProductRepository = await getProductRepository();

  console.debug('GetProductList lambda has called');
  try {
    const products = await ProductRepository.find();
    return formatJSONResponse(products);
  } catch (e) {
    console.error(e);
    return formatJSONResponse({
      error: "Internal Server Error"
    }, 500);
  }
}

export const main = middyfy(handler);
