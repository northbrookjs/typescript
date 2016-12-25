# Northbrook TypeScript

> The power of Northbrook and TypeScript together in one place

This is a home to a number of official TypeScript plugins for Northbrook.

This is the first monorepo to make use of northbrook itself, and will be the
source of many bug fixes and great polish to the system Northbrook already provides.

## Plugins

- [TypeScript Compiler](#tsc)
- [TypeScript Linter](#tslint)


### <a href="#tsc"></a> `@northbrook/tsc` - Build with the TypeScript Compiler

Using the TypeScript compiler API, this plugin will help you to build all of
your packages using the TypeScript compiler.

##### Northbrook Configuration Options

```typescript
// northbrook.ts
export = {
  plugins: [ '@northbrook/tsc' ]

  // entire object is 100% optional
  tsc?: {
    // Tells the plugin whether or not to build es2015 modules - default : false
    es2015?: boolean;
    // Tells the directory you'd like to compile into - default : lib
    directory?: string;
    // Allows you to configure the files you'd like the plugin to match and compile
    patterns?: Array<RegExp | string>,
  }
}
```

###### patterns

The `patterns` configuration is an advanced option to allow defining what files you would
like to match and have compiled. This array is an array of inputs that are accepted
by the project [`glob-expand`](https://www.npmjs.com/package/glob-expand).

The default patterns are:

```typescript
const defaultPatterns: Array<RegExp | string> =
  [
    // all typescript files
    /\.ts/,
    // but not generated files
    '!lib/**/*.*',
    '!lib/**/*.*',
    // and not test files
    '!**/__test__/**/*.*',
    '!**/*.spec.ts',
    '!**/*.test.ts',
    '!**/*Spec.ts',
    '!**/*Test.ts',
    // and not files marked to be skipped
    '!**/*.skip.ts',
  ];
```

### <a href="#tslint"></a>`@northbrook/tslint` - Lint your TypeScript files

Lint your TypeScript files with TSLint.

##### Northbrook Configuration Options

```typescript
// northbrook.ts

export = {
  plugins: ['@northbrook/tslint'],

  // this object is 100% options
  tslint: {
    patterns: Array<RegExp | string>
  }
}
```

###### patterns

The `patterns` configuration is an advanced option to allow defining what files you would
like to match and have compiled. This array is an array of inputs that are accepted
by the project [`glob-expand`](https://www.npmjs.com/package/glob-expand).

The default patterns are:

```typescript
const defaultPatterns: Array<RegExp | string> =
  [
    // all typescript files
    /\.ts/,
    // but not generated files
    '!lib/**/*.ts',
    '!lib.es2015/**/*.ts',
    // and not files marked to be skipped
    '!**/*.skip.ts',
  ];
```
