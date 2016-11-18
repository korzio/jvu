const jvu = require('../');

const validators = [
  'djv'
].map(require);

describe('jvu supports validators', () => {
  it('wraps validator', () => {
    validators.forEach((validator) => {
      const env = jvu(validator);

      expect(env).toEqual(jasmine.any(Function));
    });
  });

  describe('jvu supports example', () => {
    it('factorial', () => {
      const factorialSchema = {
        0: {
          type: 'number',
          enum: [0],
        },
        other: {
          type: 'any',
        },
      };

      validators.forEach((validator) => {
        const env = jvu(validator);
        env.add('test', factorialSchema);

        const fact = env.match({
          'test#/0': () => 1,
          'test#/other': n => n * fact(n - 1),
        });

        expect(fact(5)).toEqual(120);
      });
    });
  });
});
