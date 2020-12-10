import Record from "lib/record";
import logger from "lib/log";

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

  pipe<NewT>(
    target: GeneratorStream<Target, NewT>
  ): GeneratorStream<Target, NewT> {
    target.pipeFrom(this);
    return target;
  }
}
export default GeneratorStream;

export class OutputStream extends GeneratorStream<Record, void> {
  async handle(data: Record): Promise<void> {
    logger.bareLogger(JSON.stringify(data));
  }
}

export class DirectOutputStream extends GeneratorStream<any, void> {
  async handle(data: any): Promise<void> {
    logger.bareLogger(data);
  }
}
