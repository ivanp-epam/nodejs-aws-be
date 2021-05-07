import * as Joi from 'joi';
import {ValidationError} from "../../errors/validationError";

const rules = Joi.object({
  title: Joi.string().required(),
  description: Joi.string(),
  price: Joi.number().required(),
  count: Joi.number().required(),
}).options({abortEarly: false});

export const validate = (data: any) => {
  const result = rules.validate(data);
  if (!result.error) {
    return result.value;
  }
  const errors = {};

  result.error.details.forEach((errorDetail) => {
    errorDetail.path.forEach((path) => {
      if (!errors[path]) {
        errors[path] = [];
      }
      errors[path].push(errorDetail.message);
    });
  });
  throw new ValidationError(errors);
}
