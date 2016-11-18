const api = require('./api');

describe('api', () => {
  describe('match()', () => {
    const references = {
      '#/common': () => 1,
      '#/other': () => 2,
    };
    const env = {
      validate: (path, instance) => path !== instance,
    };

    it('executes found reference', () => {
      expect(
        api.match(
          env,
          references,
          '#/common'
        )
      ).toEqual(1);

      expect(
        api.match(
          env,
          references,
          '#/other'
        )
      ).toEqual(2);
    });

    it('when invoked without instance exposes match function', () => {
      const validate = api.match(env, references);

      expect(validate('#/common')).toEqual(1);
      expect(validate('#/other')).toEqual(2);
    });
  });
});
