import { TransformOperation } from "../operation.js";
import Executor from "../executor.js";

export class Xform extends TransformOperation {
  constructor(opts) {
    super();
    this.code = 'r.foo = "Ben"';
    this.executor = new Executor({ code: this.code });
  }

  transformRecord(record, done) {
    this.executor.run(record);
    done(record);
  }
}
export default Xform;
