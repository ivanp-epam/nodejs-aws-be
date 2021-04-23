import {validate} from "../validator";
import {ValidationError} from "../../../errors/validationError";

describe('AddProduct lambda', () => {
  describe('Check validator', () => {
    it('Should throw an exception on wrong input data', () => {
      expect(() => {
        validate({});
      }).toThrowError(ValidationError)
    });

    it('Should show error messages', () => {
      try {
        validate({});
      } catch (error) {
        expect(error.validationErrors).toStrictEqual({
          "count": ["\"count\" is required"],
          "price": ["\"price\" is required"],
          "title": ["\"title\" is required"]
        });
      }
    });

    it('Should return correct data if validation pass', () => {
      const data = {
        title: 'ololo',
        description: 'pewpew',
        price: 123,
        count: 321,
      };
      const result = validate(data);
      expect(data).toStrictEqual(result);
    });
  });
});
