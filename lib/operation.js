const stream = require("stream");

const OutputStream = (exports.OutputStream = class OutputOperation extends stream.Writable {
  constructor() {
    super({ objectMode: true });
  }

  _write(data, _, done) {
    throw new Error("Subclass must implement");
  }
});

const TransformOperation = (exports.TransformOperation = class TransformOperation extends stream.Transform {
  constructor(opts) {
    super({ objectMode: true });
  }

  _transform(data, _, cb) {
    try {
      this.transformRecord(data, data => cb(null, data));
    } catch (e) {
      cb(e, null);
    }
  }

  transformRecord() {
    throw new Error("Subclass must implement");
  }
});
