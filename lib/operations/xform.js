import { TransformOperation } from "../operation.js";
import Executor from "../executor.js";

export class Xform extends TransformOperation {
  constructor({ code }) {
    super();
    this.code = code;
    this.executor = new Executor({ code: this.code });
  }

  transformRecord(record, done) {
    this.executor.run(record);
    done(record);
  }
}
export default Xform;
