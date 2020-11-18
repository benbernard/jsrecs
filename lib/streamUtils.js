import fs from "fs";
import MultiStream from "multistream";
import { Readable, Writable } from "stream";
import { RecordStream } from "./recordStream.js";
import ndjson from "ndjson";

export function multiStreamForArgs({
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

export function objStreamFromArgs(argOpts = {}) {
  const multiStream = multiStreamForArgs(argOpts);

  const stream = s(ndjson.parse());
  multiStream.pipe(stream);

  return stream;
}

export function recordStreamFromArgs(argOpts = {}) {
  let objStream = objStreamFromArgs({
    separator: "\n",
    ...argOpts,
  });

  let recordStream = new RecordStream();
  objStream.pipe(recordStream);
  return recordStream;
}

export function s(stream) {
  stream.on("error", err => {
    throw err;
  });
  return stream;
}
