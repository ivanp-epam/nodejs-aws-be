export class ValidationError extends Error {
  readonly validationErrors;

  constructor(validationErrors: object) {
    super();
    this.validationErrors = validationErrors;
  }
}
