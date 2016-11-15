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
 * @param {Function} validator
 * @returns {Function} jvuApi
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
   * @param {String} path
   * @param {Object?} instance
   * @returns {?}
   */
  /* eslint-disable consistent-return */
  function jvuApi(path, instance) {
    if (typeof path === 'string') {
      if (arguments.length === 2) {
        return env.validate(path, instance);
      }

      return env.export(path);
    }
  }
  /* eslint-enable consistent-return */

  Object.assign(jvuApi, env, {
    env,
    add,
    validate,
    is: validate,
  }/* , api*/);

  return jvuApi;
};

module.exports = jvu;
