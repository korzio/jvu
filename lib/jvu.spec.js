const jvu = require('../');

describe('jvu', () => {
  describe('when called with', () => {
    const validateStub = () => false;
    const validator = () => ({
      validate: validateStub,
    });

    it('single string param returns a validation function', () => {
      const env = jvu(validator);
      const validate = env('');

      expect(validate(null)).toEqual(true);
    });

    it('string and object returns a result of validation', () => {
      const env = jvu(validator);
      expect(env('', null)).toEqual(true);
    });
  });

  describe('add()', () => {
    it('exists and equals native addSchema', () => {
      const expected = () => { };
      const validator = () => ({
        addSchema: expected,
      });
      const env = jvu(validator);

      expect(env.add).toEqual(expected);
    });
  });

  describe('validate(), is(), env()', () => {
    it('exist and reflects native validate', () => {
      const validator = () => ({
        validate: () => {},
      });
      const env = jvu(validator);

      expect(env.validate).toEqual(env.is);
      expect(env.is).toEqual(env);
    });
  });
});
