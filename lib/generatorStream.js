const GeneratorStream = (exports.GeneratorStream = class GeneratorStream {
  constructor({ generator = null } = {}) {
    this.generator = null;
    if (generator) this.pipeFrom(generator);
  }

  pipeFrom(generator) {
    if (this.generator) {
      throw new Error(`GeneratorStream already has a geneator!`);
    }

    this.generator = generator;
  }
  async * [Symbol.asyncIterator]() {
    for await (let data of this.generator) {
      yield await this.handle(data);
    }
  }

  async handle(data) {
    throw new Error(`Subclass should implement`);
  }
});

exports.OutputStream = class OutputStream extends GeneratorStream {
  async handle(data) {
    console.log(data);
  }
};

exports.pipeline = function pipeline(...generatorStreams) {
  if (generatorStreams.length <= 1) {
    throw new Error(
      `Pipeline called with only ${generatorStreams.length} streams`
    );
  }

  let last = generatorStreams.pop();
  let previous = last;

  for (let generator of generatorStreams.reverse()) {
    previous.pipeFrom(generator);
    previous = generator;
  }

  return last;
};
