const { partial } = require('./utils');

/**
 * @function
 * @name is
 * @description
 * Validate object along with schema
 *
 * @requires env::validate
 *
 * @param {object} env
 * @param {object/string} path
 * @param {object} instance
 * @returns {boolean} isValid
 */
function is(env, path, instance) {
  return !env.validate(path, instance);
}

/**
 * @function
 * @name find
 * @description
 * Finds & returns first appropriate instance
 *
 * @requires is
 *
 * @param {object/array} references
 * @param {object} instance
 * @returns {?}
 */
function find(env, references, instance) {
  const isArray = Array.isArray(references);
  const foundKey = Object.keys(references)
    .find(path =>
      is(env, isArray ? references[path] : path, instance)
    );

  const found = isArray ? +foundKey : references[foundKey];
  return typeof foundKey === 'undefined' ? undefined : found;
}

/**
 * @function
 * @name match
 * @description
 * Finds & execute appropriate instance
 *
 * @requires find
 *
 * @param {object} env
 * @param {object/array} references
 * @param {object} instance
 * @returns {?}
 */
function match(env, references, instance) {
  const fn = find(env, references, instance);
  if (typeof fn === 'function') {
    return fn(instance);
  }

  return fn;
}

module.exports = {
  is: partial(is, is.length),
  find: partial(find, find.length),
  match: partial(match, match.length),
};
