import Record from "lib/record";

export class GeneratorStream<Source, Target> implements AsyncIterable<Target> {
  generator: AsyncIterable<Source>;

  constructor({ generator = null } = {}) {
    this.generator = null;
    if (generator) this.pipeFrom(generator);
  }

  pipeFrom(generator: AsyncIterable<Source>): void {
    if (this.generator) {
      throw new Error(`GeneratorStream already has a geneator!`);
    }

    this.generator = generator;
  }

  async * [Symbol.asyncIterator](): AsyncGenerator<Target> {
    for await (let data of this.generator) {
      yield await this.handle(data);
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
    stream: GeneratorStream<Target, unknown>
  ): GeneratorStream<Target, unknown> {
    stream.pipeFrom(this);
    return stream;
  }
}

export class OutputStream extends GeneratorStream<Record, void> {
  async handle(data: Record): Promise<void> {
    console.log(JSON.stringify(data));
  }
}
