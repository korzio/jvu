const jvu = require('../');

describe('jvu', () => {
  describe('when called with', () => {
    const validateStub = () => true;
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

  describe('env', () => {
    it('exists', () => {
      const validator = () => ({ a: 1 });
      const env = jvu(validator);
      expect(env.env).toEqual(validator());
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

  describe('validate(), is()', () => {
    it('exist and equals native validate', () => {
      const expected = () => true;
      const validator = () => ({
        validate: expected,
      });
      const env = jvu(validator);

      expect(env.validate).toEqual(expected);
      expect(env.is).toEqual(expected);
    });
  });
});
