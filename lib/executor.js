const babel = require("@babel/core");
const recordAccess = prequire("lib/babel/recordAccess");

const Executor = (module.exports = class Executor {
  constructor(opts) {
    this.code = this.wrapCode(opts.code);
    this.count = 0;
  }

  wrapCode(input) {
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

  run(record) {
    this.count++;
    return this.code(record, this.count, _);
  }
});
