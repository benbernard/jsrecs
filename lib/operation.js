const { GeneratorStream } = prequire("lib/generatorStream");

exports.TransformOperation = class TransformOperation extends GeneratorStream {
  async handle(record) {
    throw new Error("Subclass must implement");
  }
};
