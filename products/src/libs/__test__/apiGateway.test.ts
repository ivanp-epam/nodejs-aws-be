import {formatJSONResponse} from '../apiGateway';

describe('Api Gateway', () => {
  describe('Check formatJSONResponse helper', () => {
    it('Should set default status code if it is not provided', () => {
      const result = formatJSONResponse(null);
      expect(result.statusCode).toBe(200);
    });

    it('Should set status which was provided', () => {
      const result = formatJSONResponse(null, 300);
      expect(result.statusCode).toBe(300);
    });

    it('Should encode values into JSON string', () => {
      const response = {"a": "b", "x": [1, 2, null]};
      const expected = JSON.stringify(response);

      const result = formatJSONResponse(response);
      expect(result.body).toBe(expected);
    });
  });
});
