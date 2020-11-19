const stream = require("stream");
const { s } = prequire("lib/streamUtils");

const OutputStream = (exports.OutputStream = class OutputOperation extends stream.Writable {
  constructor() {
    super({ objectMode: true });
    s(this);
  }

  _write(data, _, done) {
    throw new Error("Subclass must implement");
  }
});

const TransformOperation = (exports.TransformOperation = class TransformOperation extends stream.Transform {
  constructor(opts) {
    super({ objectMode: true });
    s(this);
  }

  async _transform(data, encoding, cb) {
    try {
      cb(null, await this.transformRecord(data));
    } catch (e) {
      cb(e, null);
    }
  }

  async transformRecord(record) {
    throw new Error("Subclass must implement");
  }
});
