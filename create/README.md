# Northbrook Typescript Create Plugin

> Create managed projects that use typescript

Designed to work out-of-the-box with ts-init, ts-mocha, ts-tsc, and ts-tslint.

## Installation

```sh
npm install --save-dev @northbrook/ts-create
```

add me to your northbrook.json

```json
{
  "plugins": [
    "northbrook-ts-create"
  ]
}
```

# API

### **northbrook ts-create [relativePathToPackage]**

Scaffolds and sets up a new managed package. Generates a folder named at
`relativePathToPackage` and generates the following files inside after prompting
for a questions to better initialize the package.

- package.json
- README.md
- src/index.ts
- test/index.ts
