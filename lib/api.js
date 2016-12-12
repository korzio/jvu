/**
 * @function
 * @name noop
 * @inner
 */
function noop() {}

/**
 * @function
 * @name partial
 * @inner
 */
function partial(fn, ...args) {
  if (typeof fn !== 'function') {
    return noop;
  }

  if (args.length === fn.length) {
    return fn(...args);
  }

  return function executor(...evalArgs) {
    return partial.apply(null, [fn, ...args, ...evalArgs]);
  };
}

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
const is = partial((env, path, instance) => !env.validate(path, instance));

/**
 * @function
 * @name not
 * @description
 * Validate object along with negative schema context
 *
 * @requires env::validate
 *
 * @param {object} env
 * @param {object/string} path
 * @param {object} instance
 * @returns {boolean} isNotValid
 */
const not = partial((env, path, instance) => !!env.validate(path, instance));

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
const find = partial((env, references, instance) => {
  const isArray = Array.isArray(references);
  const foundKey = Object.keys(references)
    .find(path =>
      is(env, isArray ? references[path] : path, instance)
    );

  const found = isArray ? +foundKey : references[foundKey];
  return typeof foundKey === 'undefined' ? undefined : found;
});

/**
 * @function
 * @name filter
 * @description
 * Filters & returns appropriate instances
 *
 * @requires is
 *
 * @param {object/array} references
 * @param {object} instance
 * @returns {array} indexes
 */
const filter = partial((env, references, instance) => {
  const isArray = Array.isArray(references);
  return Object.keys(references)
    .filter(path =>
      is(env, isArray ? references[path] : path, instance)
    )
    .map(foundKey => (isArray ? +foundKey : references[foundKey]));
});

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
const match = partial((env, references, instance) => {
  const fn = find(env, references, instance);
  if (typeof fn === 'function') {
    return fn(instance);
  }

  return fn;
});

module.exports = {
  is,
  not,
  find,
  filter,
  match,
};
