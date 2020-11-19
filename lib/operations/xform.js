const { TransformOperation } = prequire("lib/operation");
const Executor = prequire("lib/executor");

const Xform = (module.exports = class Xform extends TransformOperation {
  constructor({ code }) {
    super();
    this.code = code;
    this.executor = new Executor({ code: this.code });
  }

  async handle(record) {
    this.executor.run(record);
    return record;
  }
});
