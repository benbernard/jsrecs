import * as fs from "fs";
import MultiStream from "multistream";
import { Readable, Writable, Stream } from "stream";
import ndjson from "ndjson";

import { Record, RecordData } from "lib/record";
import { GeneratorStream } from "lib/generatorStream";

function multiStreamForArgs({
  files = [],
  streams = [process.stdin],
  separator = "",
} = {}): MultiStream {
  let originStreams: Array<Readable | (() => Stream)> = [...streams];
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

function objStreamFromArgs(argOpts = {}): ReturnType<ndjson.parse> {
  const multiStream = multiStreamForArgs(argOpts);

  const stream = s(ndjson.parse());
  multiStream.pipe(stream);

  return stream;
}

export class RecordGeneratorStream extends GeneratorStream<RecordData, Record> {
  async handle(obj: RecordData): Promise<Record> {
    return new Record(obj);
  }
}

function recordGenerator(argOpts = {}): RecordGeneratorStream {
  let objStream = objStreamFromArgs({
    separator: "\n",
    ...argOpts,
  });

  return new RecordGeneratorStream({ source: objStream });
}

function s<T extends Stream>(stream: T): T {
  stream.on("error", err => {
    throw err;
  });
  return stream;
}

export { multiStreamForArgs, objStreamFromArgs, recordGenerator, s };
