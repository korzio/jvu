const jvu = require('../');

describe('jvu', () => {
  describe('when called with', () => {
    const validateStub = () => true;
    const validator = () => ({
      validate: validateStub,
      export: () => validateStub,
    });

    it('single string param returns a validation function', () => {
      const env = jvu(validator);
      const validate = env('');

      expect(validate()).toEqual(true);
    });

    it('string and object returns a result of validation', () => {
      const env = jvu(validator);
      expect(env('', null)).toEqual(true);
    });
  });
});
