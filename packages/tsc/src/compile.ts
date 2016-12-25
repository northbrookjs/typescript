import * as ts from 'typescript';

export function compile (filesToCompile: Array<string>) {
  return function (compilerOptions: ts.CompilerOptions) {
    const program = ts.createProgram(filesToCompile, compilerOptions);

    const emitResult = program.emit();

    const diagnostics: Array<ts.Diagnostic> =
      [
        ...ts.getPreEmitDiagnostics(program),
        ...emitResult.diagnostics,
      ];

    reportDiagnostics(diagnostics);
  };
}

function reportDiagnostics(diagnostics: ts.Diagnostic[]): void {
  diagnostics.forEach(diagnostic => {
    let message = 'Error';

    if (diagnostic.file) {
      let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
      message += ` ${diagnostic.file.fileName} (${line + 1},${character + 1})`;
    }

    message += ': ' + ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');

    console.log(message);
  });
}
