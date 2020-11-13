import streams from "stream";

export class OutputOperation extends streams.Writable {
  constructor() {
    super({ objectMode: true });
  }

  _write(data, _, done) {
    throw new Error("Subclass must implement");
  }
}

export class TransformOperation extends streams.Transform {
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
}
