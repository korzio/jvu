const jvu = (validator) => {
  // function Env() {
  //   return function jvuApi() {

  //   };
  // }

  // Env.prototype = validator();

  // return new Env();

  function CS() {
    return function BC() {
      console.log(123);
    };
  }

  CS.prototype = {
    name: 'name',
  };

  const cs = new CS();
  return cs;
};

module.exports = jvu;
