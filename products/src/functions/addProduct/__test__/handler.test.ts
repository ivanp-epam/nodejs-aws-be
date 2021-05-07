import * as correctData from "./mock.correct.json"
import {InMemoryProductRepository} from "@repositories/inMemoryProductRepository";
jest.mock('@services/repository', () => ({
    getProductRepository: () => new InMemoryProductRepository()
  })
);

import {main as handler} from "../handler";

describe('AddProduct lambda', () => {
  describe('Check handler', () => {
    it('Should return http status code 200 if product has added', async () => {
      // @ts-ignore
      const response: any = await handler(correctData);
      expect(response.statusCode).toBe(200);
      const jsonBody = JSON.parse(response.body);
      const correctDataJson = correctData.body;

      expect(jsonBody.title).toBe(correctDataJson.title);
      expect(jsonBody.description).toBe(correctDataJson.description);
      expect(jsonBody.price).toBe(correctDataJson.price);
      expect(jsonBody.count).toBe(correctDataJson.count);

      expect(1).toBe(1);
    });
  });
});
