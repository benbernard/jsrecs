import { TransformOperation } from "lib/operation";
import { Executor, ExecutorEvalError } from "lib/executor";
import Record from "lib/record";

export default class Xform extends TransformOperation<Record, Record> {
  code: string;
  executor: Executor;

  constructor(
    opts: { code: string } & ConstructorParameters<typeof TransformOperation>[0]
  ) {
    super(opts);
    this.code = opts.code;
    this.executor = new Executor({ code: this.code });
  }

  async handle(record: Record): Promise<Record> {
    this.executor.run(record);
    return record;
  }
}
