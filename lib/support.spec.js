const jvu = require('../');

const validators = [
  'djv'
];

validators.forEach((name) => {
  const validator = require(name);

  describe(`jvu supports validator ${name}`, () => {
    it('creates wrapper function', () => {
      const env = jvu(validator);
      expect(env).toEqual(jasmine.any(Function));
    });

    it('valid by validator.spec.json', () => {
      const env = jvu(validator);
      const nativeEnv = validator();

      const validatorSchema = require('./validator.spec.json');
      env.add('validator', validatorSchema);

      expect(env.is('validator', validator)).toEqual(true);
      expect(env.is('validator#/env/properties/validate', nativeEnv.validate)).toEqual(true);
    });

    describe('with working example', () => {
      it('is or is not', () => {
        const jsonSchema = {
          common: {
            properties: {
              type: {
                enum: ['common'],
              },
            },
            required: [
              'type'
            ],
          },
        };

        const env = jvu(validator);
        env.add('test', jsonSchema);

        const commonObject = { type: 'common' };
        const unknownObject = { type: 'unknown' };

        expect(env.is('test#/common', commonObject)).toEqual(true);
        expect(env.is('test#/common', unknownObject)).toEqual(false);
        expect(env.not('test#/common', unknownObject)).toEqual(true);
        expect(env.not('test#/common', commonObject)).toEqual(false);

        expect(env.not('test#/common')(unknownObject)).toEqual(true);
        expect(env.not('test#/common')(commonObject)).toEqual(false);
      });

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

        const env = jvu(validator);
        env.add('test', factorialSchema);

        const fact = env.match({
          'test#/0': () => 1,
          'test#/other': n => n * fact(n - 1),
        });

        expect(fact(5)).toEqual(120);
      });

      it('if-less', () => {
        const ifLessSchema = {
          null: {
            type: 'null',
          },
          other: {
            type: 'any',
          },
        };
        const ifLessCases = {
          'test#/null': () => NaN,
          'test#/other': () => 1,
        };

        const env = jvu(validator);
        env.add('test', ifLessSchema);
        const ifLess = env.match(ifLessCases);

        expect(ifLess(null)).toEqual(NaN);
        expect(env.match(ifLessCases, null)).toEqual(NaN);

        expect(ifLess(1)).toEqual(1);
        expect(env.match(ifLessCases, 1)).toEqual(1);
      });

      it('promise chain', (done) => {
        const promiseSchema = {
          null: {
            type: 'null',
          },
          common: {
            type: 'object',
            properties: {
              type: {
                type: 'string',
                enum: ['common'],
              },
            },
            required: ['type'],
          },
          other: {
            type: 'any',
          },
          error: {
            system: {
              properties: {
                type: {
                  type: 'string',
                  enum: ['system'],
                },
              },
              required: ['type'],
            },
            common: {
              properties: {
                type: {
                  type: 'string',
                  enum: ['common'],
                },
              },
              required: ['type'],
            },
          },
        };
        const promiseResolveCases = {
          'test#/null': () => 'so far so good',
          'test#/common': () => 'common',
          'test#/other': () => 'enough',
        };
        const promiseRejectCases = {
          'test#/error/system': () => 'this is bad',
          'test#/error/common': () => '\\_(ツ)_/¯',
        };

        const cases = [{
          promise: resolve => resolve(null),
          result: promiseResolveCases['test#/null'](),
        }, {
          promise: resolve => resolve({ type: 'common' }),
          result: promiseResolveCases['test#/common'](),
        }, {
          promise: resolve => resolve({}),
          result: promiseResolveCases['test#/other'](),
        }, {
          promise: (resolve, reject) => reject({ type: 'system' }),
          result: promiseRejectCases['test#/error/system'](),
        }, {
          promise: (resolve, reject) => reject({ type: 'common' }),
          result: promiseRejectCases['test#/error/common'](),
        }];

        const env = jvu(validator);
        env.add('test', promiseSchema);

        cases.reduce((internalMemo, some) =>
          internalMemo.then(
            new Promise(some.promise)
              .then(
              env.match(promiseResolveCases),
              env.match(promiseRejectCases)
              )
              .then((result) => {
                expect(result).toEqual(some.result);
              })
          ),
          Promise.resolve()
        )
          .then(done)
          .catch(done.fail);
      });
    });
  });
});
