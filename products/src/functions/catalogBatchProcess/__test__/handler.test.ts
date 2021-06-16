import * as correctData from "./mock.correct.json"

const getProductRepository = jest.fn();
const sendMessage = jest.fn();

jest.mock('@services/repository', () => ({
    getProductRepository: () => ({add: getProductRepository})
  })
);

jest.mock('@functions/catalogBatchProcess/notifications', () => ({
    sendMessage: sendMessage
  })
);

import {main as handler} from "../handler";

describe('Catalog Batch Process', () => {
  describe('Check handler', () => {
    it('Should add products to repository and send message', async () => {
      // @ts-ignore
      const response: any = await handler(correctData);

      const products = correctData.Records.map((record) => JSON.parse(record.body));

      expect(getProductRepository).toHaveBeenCalledTimes(products.length);
      products.forEach((product) => {
        expect(getProductRepository).toHaveBeenCalledWith(product);
      });

      expect(sendMessage).toHaveBeenCalled();
    });
  });
});
