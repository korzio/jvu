const jvu = (validator) => {
  const fn = function jvuApi() {

  };

  const env = validator();
  const { addSchema: add } = env;

  Object.assign(fn, env, {
    env,
    add,
  }/* , api*/);

  return fn;
};

module.exports = jvu;
