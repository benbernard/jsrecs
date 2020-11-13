import fs from "fs";
import MultiStream from "multistream";
import { Readable, Transform } from "stream";
import { RecordStream } from "./recordStream.js";
import LDJSONStream from "ld-jsonstream";

export function multiStreamForArgs({
  files = [],
  streams = [process.stdin],
  separator = "",
} = {}) {
  let originStreams = [
    ...streams,
    ...files.map(name => () => fs.readStream(name)),
  ];

  let separatedStreams = [];
  for (let stream of originStreams) {
    separatedStreams.push(stream);
    if (separator) separatedStreams.push(Readable.from(separator));
  }

  return new MultiStream(separatedStreams);
}

export function objStreamFromArgs(argOpts = {}) {
  let multiStream = multiStreamForArgs(argOpts);
  let stream = new LDJSONStream({ objectMode: true });
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
