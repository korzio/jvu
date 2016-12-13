const jvu = require('../');

const validators = {
  ajv: (ajv) => {
    const env = ajv();
    const { addSchema, validate } = env;

    return Object.assign(env, {
      addSchema: (schema, key) => addSchema(key, schema),
      validate: (path, obj) => (validate(path, obj) ? '' : 'error'),
    });
  },
  djv: true,
  jjv: true,
};

Object.keys(validators).forEach((name) => {
  const validator = require(name);
  const getEnv = () => jvu(validator, validators[name]);

  describe(`jvu supports validator ${name}`, () => {
    it('creates wrapper function', () => {
      const env = getEnv();
      expect(env).toEqual(jasmine.any(Function));
    });

    it('has required functionality', () => {
      const nativeEnv = validator();
      expect(typeof nativeEnv.validate).toEqual('function');
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

        const env = getEnv();
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
            type: 'number',
          },
        };

        const env = getEnv();
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
            type: 'number',
          },
        };
        const ifLessCases = {
          'test#/null': () => NaN,
          'test#/other': () => 1,
        };

        const env = getEnv();
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
            type: 'object',
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

        const env = getEnv();
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
