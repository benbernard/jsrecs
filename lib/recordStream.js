import { Transform } from "stream";
import Record from "./record.js";

export class RecordStream extends Transform {
  constructor(opts) {
    super({
      objectMode: true,
      ...opts,
    });
  }

  _transform(obj, encoding, cb) {
    cb(null, new Record(obj));
  }
}

export default RecordStream;
