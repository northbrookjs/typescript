import * as ts from 'typescript';

export const defaultCompilerOptions: ts.CompilerOptions =
  {
    allowJs: false,
    moduleResolution: ts.ModuleResolutionKind.NodeJs,
    lib: [
      'es5',
      'es2015',
    ],
    noImplicitAny: true,
    sourceMap: true,
    noUnusedParameters: true,
    strictNullChecks: true,
  };
