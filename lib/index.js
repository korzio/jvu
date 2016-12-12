const api = require('./api');

/**
 * @module jvu
 * @name jvu
 * @description
 * jvu package wraps json schema validator environment with a set of utilities
 */
/**
 * @function
 * @name jvu
 * @description
 * Entry point for jvu package
 *
 * @param {function} validator
 * @param {function?} adapter
 * @returns {function} jvuApi
 */
const jvu = (validator, adapter) => {
  let env;
  switch (typeof adapter) {
    case 'function':
      env = adapter(validator);
      break;
    case 'undefined':
    default:
      env = validator();
  }

  const {
    addSchema: add,
  } = env;

  const apis = Object.keys(api)
    .reduce(
      (memo, key) => Object.assign({
        [key]: api[key](env),
      }, memo)
    , {});

  // Entry point for generated environment
  Object.assign(
    apis.is,
    env,
    {
      env,
      add,
      validate: apis.is,
    },
    apis
  );

  return apis.is;
};

module.exports = jvu;
