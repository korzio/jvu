const api = require('./api');
const { partial } = require('./utils');

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
 * @returns {function} jvuApi
 */
const jvu = (validator) => {
  const env = validator();
  const {
    addSchema: add,
    validate,
  } = env;

  /**
   * @function
   * @name jvuApi
   * @description
   * Entry point for generated environment
   *
   * @requires env::validate
   *
   * @param {string} path
   * @param {object?} instance
   * @returns {?}
   */
  const jvuApi = partial(env.validate, 2);

  Object.assign(jvuApi, env, {
    env,
    add,
    validate,
    is: validate,
  }, Object.keys(api)
    .reduce(
      (memo, key) => Object.assign({
        [key]: api[key](env),
      }, memo)
    )
  );

  return jvuApi;
};

module.exports = jvu;
