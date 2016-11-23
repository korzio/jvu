const api = require('./api');

describe('api', () => {
  describe('is()', () => {
    it('return boolean isValid', () => {
      const env = {
        validate: a => a === 'a' ? undefined : 'b',
      };

      expect(api.is(env, 'a', null)).toEqual(true);
      expect(api.is(env, 'b', null)).toEqual(false);
    });
  });

  describe('find()', () => {
    const env = {
      validate: (path, instance) => path === instance ? undefined : 'error',
    };

    it('implements switch strategy for object and returns value by key', () => {
      const references = {
        '#/common': 1,
        '#/other': 2,
      };

      expect(
        api.find(
          env,
          references,
          '#/common'
        )
      ).toEqual(1);

      expect(
        api.find(
          env,
          references,
          '#/other'
        )
      ).toEqual(2);

      expect(
        api.find(
          env,
          references,
          '#/noname'
        )
      ).toEqual(undefined);
    });

    it('implements switch strategy for array and returns array index or undefined', () => {
      const references = ['#/common', '#/other'];

      expect(
        api.find(
          env,
          references,
          '#/common'
        )
      ).toEqual(0);

      expect(
        api.find(
          env,
          references,
          '#/other'
        )
      ).toEqual(1);

      expect(
        api.find(
          env,
          references,
          '#/noname'
        )
      ).toEqual(undefined);
    });
  });

  describe('match()', () => {
    const references = {
      '#/common': () => 1,
      '#/other': () => 2,
    };
    const env = {
      validate: (path, instance) => path === instance ? undefined : 'error',
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

      expect(
        api.match(
          env,
          references,
          '#/noname'
        )
      ).toEqual(undefined);
    });

    it('when invoked without instance exposes match function', () => {
      const validate = api.match(env, references);

      expect(validate('#/common')).toEqual(1);
      expect(validate('#/other')).toEqual(2);
    });
  });
});
