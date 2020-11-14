import babel from "@babel/core";
import _ from "../lodash.js";

export class Executor {
  constructor(opts) {
    this.code = this.wrapCode(opts.code);
    this.count = 0;
  }

  wrapCode(code) {
    if (code.indexOf("return") === -1) {
      if (code.indexOf(";") === -1) {
        // Maybe we have 1 expression, should really use a real parser
        code = `return ${code}`;
      }
    }

    let wrapped;
    // eslint-disable-next-line no-eval
    eval(`
       wrapped = function (r, LINE, _) {
         ${code}
       };
    `);

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
