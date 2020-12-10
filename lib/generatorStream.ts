import Record from "lib/record";
import { bareLogger } from "lib/log";

type ErrorHandler = (Error) => void;

function defaultErrorHandler(e: Error): void {
  throw e;
}

export class GeneratorStream<Source, Target> implements AsyncIterable<Target> {
  source: AsyncIterable<Source>;
  onError: ErrorHandler;

  constructor({ source = null, onError = defaultErrorHandler } = {}) {
    this.source = null;
    if (source) this.pipeFrom(source);
    this.onError = onError;
  }

  pipeFrom(source: AsyncIterable<Source>): void {
    if (this.source) {
      throw new Error(`GeneratorStream already has a source!`);
    }

    this.source = source;
  }

  async * [Symbol.asyncIterator](): AsyncGenerator<Target> {
    for await (let data of this.source) {
      try {
        yield await this.handle(data);
      } catch (e) {
        this.onError(e);
      }
    }
  }

  async handle(data: Source): Promise<Target> {
    throw new Error(`Subclass should implement`);
  }

  async exhaust(): Promise<void> {
    for await (let unused of this) {
      // noop just to run the iterator
    }
  }

  pipe(
    target: GeneratorStream<Target, unknown>
  ): GeneratorStream<Target, unknown> {
    target.pipeFrom(this);
    return target;
  }
}

export class OutputStream extends GeneratorStream<Record, void> {
  async handle(data: Record): Promise<void> {
    bareLogger(JSON.stringify(data));
  }
}
