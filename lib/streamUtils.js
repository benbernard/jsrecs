const fs = require("fs");
const MultiStream = require("multistream");
const { Readable, Writable } = require("stream");
const ndjson = require("ndjson");

const RecordStream = prequire("lib/recordStream");

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
  multiStream.on("end", () => console.log("multistream end"));

  const stream = s(ndjson.parse());
  multiStream.pipe(stream);

  stream.on("end", () => console.log("json parsed end"));

  return stream;
}

function recordStreamFromArgs(argOpts = {}) {
  let objStream = objStreamFromArgs({
    separator: "\n",
    ...argOpts,
  });

  let recordStream = new RecordStream();
  objStream.pipe(recordStream);
  return recordStream;
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
  recordStreamFromArgs,
  s,
};
