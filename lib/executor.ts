import * as babel from "@babel/core";
import recordAccess from "lib/babel/recordAccess";
import _ from "lib/lod";
import Record from "lib/record";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyReturn = any;

type WrappedFunction = (Record, number, _) => AnyReturn;

export default class Executor {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  code: WrappedFunction;
  count: number;

  constructor(opts: { code: string }) {
    this.code = this.wrapCode(opts.code);
    this.count = 0;
  }

  wrapCode(input: string): WrappedFunction {
    input = `wrapped = function _jsrecsExecutor(r, LINE, _) {
      ${input}
    }`;

    let { code: transformedCode } = babel.transform(input, {
      plugins: [recordAccess, "implicit-return"],
    });

    let wrapped;

    // eslint-disable-next-line no-eval
    eval(transformedCode);

    return wrapped;
  }

  run(record: Record): AnyReturn {
    this.count++;
    return this.code(record, this.count, _);
  }
}
