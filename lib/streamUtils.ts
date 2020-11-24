const fs = require("fs");
const MultiStream = require("multistream");
const { Readable, Writable } = require("stream");
const ndjson = require("ndjson");
const Record = prequire("lib/record");
const { GeneratorStream } = prequire("lib/generatorStream");

function multiStreamForArgs({
  files = [],
  streams = [process.stdin],
  separator = "",
} = {}) {
  let originStreams = [...streams];
  if (files.length > 0) {
    originStreams = files.map(path => () => s(fs.createReadStream(path)));
  }

  let separatedStreams = [];
  for (let stream of originStreams) {
    separatedStreams.push(stream);
    if (separator) separatedStreams.push(Readable.from(separator));
  }

  return s(new MultiStream(separatedStreams));
}

function objStreamFromArgs(argOpts = {}) {
  const multiStream = multiStreamForArgs(argOpts);

  const stream = s(ndjson.parse());
  multiStream.pipe(stream);

  return stream;
}

class RecordGeneratorStream extends GeneratorStream {
  async handle(obj) {
    return new Record(obj);
  }
}
exports.RecordGeneratorStream = RecordGeneratorStream;

function recordGenerator(argOpts = {}) {
  let objStream = objStreamFromArgs({
    separator: "\n",
    ...argOpts,
  });

  return new RecordGeneratorStream({ generator: objStream });
}

function s(stream) {
  stream.on("error", err => {
    throw err;
  });
  return stream;
}

module.exports = {
  multiStreamForArgs,
  objStreamFromArgs,
  recordGenerator,
  s,
};
