import 'source-map-support/register';

import {formatJSONResponse} from '@libs/apiGateway';
import {middyfy} from '@libs/lambda';
import {getProductRepository} from '@services/repository'
import {validate} from './validator'
import {ValidationError} from "../../errors/validationError";


const handler = async (event: any) => {
  const ProductRepository = await getProductRepository();
  console.debug(`AddProduct lambda has called with body:${JSON.stringify(event)}`);
  try {
    const body = event.body;
    const product = await validate(body);
    const productResult = await ProductRepository.add(product);
    return formatJSONResponse(productResult);
  } catch (error) {
    if (error instanceof ValidationError) {
      console.warn('Add product validation error');
      return formatJSONResponse({
        error: error.validationErrors
      }, 400);
    }

    console.error(error);
    return formatJSONResponse({
      error: "Internal Server Error"
    }, 500);
  }
}
export const main = middyfy(handler);
