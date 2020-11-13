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

    console.log(code);
    let wrapped;
    // eslint-disable-next-line no-eval
    eval(`
       wrapped = function (r, LINE) {
         ${code}
       };
    `);

    return wrapped;
  }

  run(record) {
    this.count++;
    return this.code(record, this.count);
  }
}

// Support
// r.prop = "Foo"

export default Executor;
