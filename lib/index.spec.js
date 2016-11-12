const jvu = require('../');

describe('jvu', () => {
  it('exists', () => {
    expect(jvu).toEqual(jasmine.any(Function));
  });

  it('wraps validator', () => {
    const validator = () => {};
    const env = jvu(validator);

    expect(env).toEqual(jasmine.any(Function));
  });

  it('exposes validator api', () => {
    const validator = () => ({
      test: 123,
    });
    const env = jvu(validator);

    expect(env.test).toEqual(validator().test);
  });
});
