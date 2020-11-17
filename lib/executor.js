import babel from "@babel/core";
import _ from "../lodash.js";
import recordAccess from "./babel/recordAccess.js";
import forceReturn from "./babel/forceReturn.js";

export class Executor {
  constructor(opts) {
    this.code = this.wrapCode(opts.code);
    this.count = 0;
  }

  wrapCode(input) {
    input = `wrapped = function _jsrecsExecutor(r, LINE, _) {
      ${input}
    }`;

    let { code: transformedCode } = babel.transform(input, {
      plugins: [forceReturn, recordAccess],
    });

    let wrapped;
    // eslint-disable-next-line no-eval
    eval(transformedCode);

    return wrapped;
  }

  run(record) {
    this.count++;
    return this.code(record, this.count, _);
  }
}

// Support
// r.prop = "Foo"

export default Executor;
