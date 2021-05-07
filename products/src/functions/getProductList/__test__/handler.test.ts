import * as correctData from "./mock.correct.json"
import {InMemoryProductRepository} from "@repositories/inMemoryProductRepository";

jest.mock('@services/repository', () => ({
    getProductRepository: () => new InMemoryProductRepository()
  })
);

import {main as handler} from "../handler";

describe('GetProductList lambda', () => {
  describe('Check handler', () => {
    it('Should return http status code 200 if the entry exists', async () => {
      // @ts-ignore
      const response: any = await handler(correctData);
      expect(response.statusCode).toBe(200);
    });
  });
});
