function partial(fn, length, ...args) {
  if (typeof fn !== 'function') {
    return function noop() { };
  }

  if (args.length === length) {
    return fn(...args);
  }

  return function executor(...evalArgs) {
    return partial.apply(null, [fn, length, ...args, ...evalArgs]);
  };
}

module.exports = {
  partial,
};
