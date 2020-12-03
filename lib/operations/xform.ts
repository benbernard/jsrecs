import { TransformOperation } from "lib/operation";
import Executor from "lib/executor";
import Record from "lib/record";

export default class Xform extends TransformOperation<Record, Record> {
  code: string;
  executor: Executor;

  constructor({ code }: { code: string }) {
    super();
    this.code = code;
    this.executor = new Executor({ code: this.code });
  }

  async handle(record: Record): Promise<Record> {
    this.executor.run(record);
    return record;
  }
}
