import * as correctData from "./mock.correct.json"
jest.mock('@services/s3', () => ({
  getURLForUpload: async () => "ololo_pewpew"
  })
);

import {main as handler} from "../handler";

describe('importProductsFile Lambda handler', () => {
  describe('Generate S3 url', () => {
    it('Should generate s3 URL', async () => {
      // @ts-ignore
      const response: any = await handler(correctData);
      expect(response.statusCode).toBe(200);
      expect(response.body).toBe(JSON.stringify('ololo_pewpew'));
    })
  });
});
