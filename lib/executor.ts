import * as babel from "@babel/core";
import recordAccess from "lib/babel/recordAccess";
import _ from "lib/lod";
import Record from "lib/record";
import StackTracey from "stacktracey";
import outdent from "outdent";

// Alias fro Entry... is this right?
type Entry = ReturnType<StackTracey["withSourceAt"]>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyReturn = any;

type WrappedFunction = (Record, number, _) => AnyReturn;

export class ExecutorError extends Error {
  originalError: Error;
  executor: Executor;

  constructor(e: Error, executor: Executor) {
    super(e.message);
    this.originalError = e;
    this.executor = executor;
    this.name = this.constructor.name;
  }

  prettyError(): string {
    throw new Error("subclass should implement");
  }
}

export class ExecutorParseError extends ExecutorError {
  prettyError(): string {
    const e = this.originalError;
    return `${e.name} ${e.message}`;
  }
}

export class ExecutorEvalError extends ExecutorError {
  prettyError(): string {
    return this.executor.formatError(this.originalError);
  }
}

export class Executor {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  code: WrappedFunction;
  count: number;
  transformedCode: string;
  _transformedCodeLines?: string[];

  constructor(opts: { code: string }) {
    this.code = this.wrapCode(opts.code);
    this.count = 0;
  }

  wrapCode(input: string): WrappedFunction {
    input = `function _jsrecsExecutor(r, LINE, _) {
      ${input}
    }; _jsrecsExecutor`;

    try {
      let { code: transformedCode } = babel.transform(input, {
        plugins: [recordAccess, "implicit-return"],
      });

      this.transformedCode = transformedCode;

      // eslint-disable-next-line no-eval
      return eval(transformedCode);
    } catch (e) {
      if (e.code === "BABEL_PARSE_ERROR") {
        throw new ExecutorParseError(e, this);
      } else {
        throw e;
      }
    }
  }

  formatError(e: Error): string {
    let stack = new StackTracey(e).withSources();
    if (stack.items[0].file.indexOf("<anonymous>") === -1) throw e;

    let firstCodeLine = this.findCode(stack.items[0]);
    stack.items[0].sourceLine = firstCodeLine;

    return outdent`
      ${e.name} - ${e.message}
          ${firstCodeLine}
          ${" ".repeat(stack.items[0].column - 1)}^
    `;
  }

  get transformedCodeLines(): string[] {
    this._transformedCodeLines ??= this.transformedCode.split("\n");
    return this._transformedCodeLines;
  }

  findCode(item: Entry): string {
    return this.transformedCodeLines[item.line - 1];
  }

  run(record: Record): AnyReturn {
    this.count++;

    try {
      return this.code(record, this.count, _);
    } catch (e) {
      throw new ExecutorEvalError(e, this);
    }
  }
}

export default Executor;
