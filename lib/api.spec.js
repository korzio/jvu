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
});

