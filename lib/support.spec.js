const jvu = require('../');

const validators = [
  'djv',
].map(require);

describe('jvu supports validators', () => {
  it('wraps validator', () => {
    validators.forEach((validator) => {
      const env = jvu(validator);
      expect(env).toEqual(jasmine.any(Function));
    });
  });
});
