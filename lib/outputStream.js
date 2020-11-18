import { Writable } from "stream";

export default class OutputStream extends Writable {
  constructor(opts) {
    super({
      objectMode: true,
      ...opts,
    });
  }

  write(obj) {
    console.log(JSON.stringify(obj));
  }
}
