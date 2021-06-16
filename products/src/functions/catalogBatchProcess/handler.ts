import 'source-map-support/register';

import {middyfy} from '@libs/lambda';
import {SQSEvent} from "aws-lambda";
import {getProductRepository} from '@services/repository'
import {validate} from '../../validators/validator'
import {sendMessage} from "@functions/catalogBatchProcess/notifications";

const handler = async (event: SQSEvent) => {
  const products = event.Records.map(({body}) => JSON.parse(body));

  console.log(`Received products: ${products.length}`);

  const repository = await getProductRepository();

  let successImported = 0;

  for (const product of products) {
    try {
      validate(product);
      await repository.add(product);
      successImported++;
    } catch (e) {
      console.error(e);
    }
  }

  await sendMessage(
    'Products import',
    `Products import statistic:
       Successful import: ${successImported}
       Failed import: ${products.length - successImported}
       Total: ${products.length}`
  );
}

export const main = middyfy(handler);
