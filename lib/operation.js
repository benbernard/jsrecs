import streams from "stream";

export class OutputOperation extends streams.Writable {
  constructor() {
    super({ objectMode: true });
  }

  write(data, _, done) {
    throw new Error("Subclass must implement");
  }
}

export class TransformOperation extends streams.Transform {
  constructor() {
    super({ objectMode: true });
  }

  transform(data, _, done) {
    throw new Error("Subclass must implement");
  }
}
