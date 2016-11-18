const { partial } = require('./utils');

/**
 * @function
 * @name find
 * @description
 * Finds appropriate instance
 *
 * @requires env::validate
 *
 *
 * @param {object/array} references
 * @param {object?} instance
 * @returns {?}
 */
/* eslint-disable consistent-return, no-plusplus, no-restricted-syntax */
function find(env, references, instance) {
  let path;
  let i;
  let resultType;

  if (references instanceof Array) {
    for (i = 0; i < references.length; i++) {
      path = references[i];
      if (!env.validate(path, instance)) {
        resultType = i;
        break;
      }
    }
  } else {
    for (path in references) {
      if (!env.validate(path, instance)) {
        resultType = references[path];
        break;
      }
    }
  }

  return resultType;
}
/* eslint-enable consistent-return, no-plusplus, no-restricted-syntax */
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
 * @param {object?} instance
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
  find: partial(find, find.length),
  match: partial(match, match.length),
};
