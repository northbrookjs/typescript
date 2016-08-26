# Northbrook TSLint

> Lint your typescript packages

## Get

```sh
npm install --save-dev @northbrook/tslint tslint
```

This only has a peerDependency upon tslint so you can specify the version
yourself.

## Usage

```sh
northbrook tslint
```

Lints all managed packages with `tslint` configured via `tslint.json` which should
be located next to your `northbrook.json` file.
