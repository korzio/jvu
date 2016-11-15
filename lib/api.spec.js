const jvu = require('../');

describe('api', () => {
  describe('env', () => {
    it('exists', () => {
      const validator = () => ({});
      const env = jvu(validator);
      expect(env.env).toEqual(validator());
    });
  });

  describe('add()', () => {
    it('exists and equals native addSchema', () => {
      const expected = () => {};
      const validator = () => ({
        addSchema: expected,
      });
      const env = jvu(validator);

      expect(env.add).toEqual(expected);
    });
  });

  describe('validate(), is()', () => {
    it('exist and equals native validate', () => {
      const expected = () => {};
      const validator = () => ({
        validate: expected,
      });
      const env = jvu(validator);

      expect(env.validate).toEqual(expected);
      expect(env.is).toEqual(expected);
    });
  });
});

