# Northbrook TypeScript

> The power of Northbrook and TypeScript together in one place

This is a home to a number of official TypeScript plugins for Northbrook.

This is the first monorepo to make use of northbrook itself, and will be the
source of many bug fixes and great polish to the system Northbrook already provides.

To find more information about each plugin take a look at the README in each
plugin directory.

## Plugins

- `build` - Build your packages with Typescript and `tsc`
- `create` - Creates a new package ready to be used with TypeScript
- `init` - Initializes your Northbrook project to be configured for TypeScript
- `lint` - Lints your packages with TSLint
- `mocha` - Test your packages with mocha + ts-node

## Caveat

None of the plugins depend upon TypeScript directly, and the default
configurations are extremely biased to work only with TypeScript 2.0, but do not
explicitly depend upon it, so you must install one yourself.
