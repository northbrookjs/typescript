# Northbrook TypeScript build

Builds all managed packages with `tsc`. Configurable via `tsconfig.json`.
It will first look within the package directory, and then the top-level next to
your `northbrook.json`.

## Get it

```sh
npm install --save-dev @northbrook/ts-build
```

And in your `northbrook.json`

```json
{
  "plugins": [
    "northbrook-ts-build"
  ]
}
```

## Usage

```sh
northbrook ts-build
```
