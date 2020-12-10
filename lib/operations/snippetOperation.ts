import { TransformOperation } from "lib/operation";
import { Executor } from "lib/executor";

export default class SnippetOperation<S, T> extends TransformOperation<S, T> {
  code: string;
  executor: Executor;

  constructor(
    opts: { code: string } & ConstructorParameters<typeof TransformOperation>[0]
  ) {
    super(opts);
    this.code = opts.code;
    this.executor = new Executor({ code: this.code });
  }
}
