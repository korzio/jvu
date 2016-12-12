# JVU

[![Build Status](https://travis-ci.org/korzio/jvu.svg?branch=master)](https://travis-ci.org/korzio/jvu)

Json-schema Validator Utilities

[Json-schema](https://tools.ietf.org/html/draft-zyp-json-schema-04) is a declaration of document type in a json format.
Basic usage of a json schema is validation, but also it might bring a clear picture of protocols used in an application.

What are reasons to use json-schema?
- Validation (type checking)
- Protocols (database & API description)

Anything else?
Lots of things, but this package is about functional programming and awesome techniques, that can be achieved with json-schema usage:
- [Matching pattern](https://en.wikipedia.org/wiki/Pattern_matching)
- [Case Classes pattern](http://docs.scala-lang.org/tutorials/tour/case-classes.html)
- [if-less pattern](http://alisnic.github.io/posts/ifless/)

## Features

- Use any json-schema validator (which supports [basic protocol](https://github.com/korzio/jvu/blob/master/lib/validator.spec.json))
- Expose native environment API

// shorthands for native API
- jvu.add('', schema) or env.addSchema
- jvu('', object) or `validate/is`

// new API
- jvu.match({ '': value })
- jvu.find([''])
- jvu.filter([''])

## Terms

- **validator** - a json-schema validator used for internal tasks
- **validation function** - a generated by path or schema function which checks any given argument among with a schema and returns isValid value

## Support

List of supported json-schema validators

- **[djv](https://www.npmjs.com/package/djv)**

## Usage

Lets have an example schema

```
jsonSchema = {
  "common": {
    "properties": {
      "type": {
        "enum": ["common"]
      }
    },
    "required": [
      "type"
    ]
  }
};
```

### initialize & add

Utils will create an empty environment with a given validator.

```
jvu = require('jvu')(validator);
```

In order to support different json-schema validators api the second argument in jvu constructor provides a wrapper function, which is used as an adapter for environment.

```
jvu = require('jvu')(validator, validator => ({
  validate: nil =>
    nil ? validator.customValidate('any', nil) : false
}))
```

Validator environment is available with a `jvu.env` link. However, created `jvu` environment is actually inherited from validator environment, so you can use it if it does not intercept. This is done for the reason to decrease API changes needed to integrate `jvu` to existing code.

Use `add` to add json schema after initialization

```
jvu.add('', jsonSchema);
```

### jvu('', ?) - validate/is

Use `validate/is` to check an object by schema reference.
`jvu('', ?)` is a short notation for `validate/is`.

```
jvu.validate('#/common', { type: 'common' }) // => true
jvu.is('#/other', { type: 'common' }) // => false
jvu('#/other', { type: 'common' }) // => false
```

When it's called without a second argument - it returns a validation function, which can be used in further calculations.

```
const validate = jvu('#/common');
validate({ type: 'common' }) // => true
```

The generated validation function accepts object as a param and returns the `isValid` flag.
- **one argument** - partial execution,
- **two arguments** - returns a value.

```
var testCommon = jvu('#/common');
[commonObj].map(testCommon) // => [true]

var testNotCommon = jvu.generate('#/common', true);
[commonObj].map(testNotCommon) // => [false]
```

Partial execution is very helpful in `each`, `find` and other iterable operations.

### jvu.not('', ?) - !jvu.is

Same functionality as `jvu.is` but with an oposite meaning.
Validation function returns the `isNotValid` flag.

```
jvu.not('#/common', { type: 'common' }) // => false
jvu.not('#/other', { type: 'common' }) // => true
```

### jvu.match({}, ?)

Use `match` as a [Matching pattern](https://en.wikipedia.org/wiki/Pattern_matching).

```
jvu.match({ '#/common': () => 1 }, commonObj) // => 1
jvu.match({ '#/common': () => 1 }, unknownObj) // => undefined

// ...
jvu.match({
  '#/0': () => 0,
  '#/other': () => 1
}, 0); // => 1
```

#### Factorial

This comes from [funcy](https://github.com/bramstein/funcy) package

```
const fact = jvu.match({
  '#/0': () => 1,
  '#/other': n => n * fact(n - 1)
});

fact(5) // => 120
```

#### [if-less](http://alisnic.github.io/posts/ifless/)

```
/**
if(some === null) { throw new Error('#/null') }
else { process() }
*/// =>

jvu.match({
  '#/null': () => throw new Error('#/null'),
  '#/other': process,
}, some)
```

#### Declarative Promises

A better example of `if-less` or `Matching Pattern` would be a stream (in Reactive Programming) or Promise chain
```
new Promise((resolve, reject) => resolve({ type: 'common' }))
.then(
  jvu.match({
    '#/null': () => 'so far so good',
    '#/common': () => 'common',
    '#/other': () => 'enough',
  }),
  jvu.match({
    '#/error/system': () => 'this is bad',
    '#/error/common': () => '\_(ツ)_/¯',
  })
)
.then(result => console.log(result)); // => 'common'
```

### jvu.find({}, ?)

Use `find` to ease a `switch` condition. A difference between `match` is that `find` only returns a given result, when `match` is also executing found expression. Both `find` and `match` method can use either object or array as a param.

```
jvu.find(['#/common'], commonObj) // => 0
jvu.find({ '#/common': 1 }, unknownObj) // => undefined
```

When executed with an object it returns a value by found key, but when executed with an array returns an index of founded item. It looks a bit inconsistent, nevetheless it has a reason to output an oposite information comparing to input.

### jvu.filter({}, ?)

Filters all appropriate pathes. This pattern does not exist with a function call (like `match` is a `find` with call).

```
jvu.filter({ '#/common': 1, '#/all': 2 }, unknownObj) // => [1, 2]
```

## API

- **add(String namespace, Object jsonSchema)** add schema to existing environment
- **jvu(String/Object reference[, Object instance])** validate object by schema reference. Shorthands - **validate**, **is**
- **not(String/Object reference[, Object instance])** validate object by schema reference with negative case.
- **match(Object/Array types[, Object instance])** iterates through an object or array to match appropriate schema for given argument. Executes found function. Returns `undefined` if not found.
- **find(Object/Array types[, Object instance])** iterates through an object or array to find appropriate schema for given argument. Returns `undefined` if not found.
- **filter(Object/Array types[, Object instance])** iterates through an object or array to filter appropriate schemas for given argument. Returns `Array` with values.
- **env** original environment

## References

- [djv - dynamic json-schema validator](https://www.npmjs.com/package/djv)
- [funcy - Functional Pattern Matching in JavaScript](https://github.com/bramstein/funcy)