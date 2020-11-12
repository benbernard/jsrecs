import LDJSONStream from "ld-jsonstream";
import { Readable } from "stream";
import fs from "fs";
import EventEmitter from "events";
import _ from "../lodash.js";
import Record from "./record.js";
import MultiStream from "multistream";

export default class JSONInputStream extends EventEmitter {
  constructor({ files = [], streams = [process.stdin] } = {}) {
    super();

    this.multiStream = this.createMultiStream(streams, files);
    this.mainStream = this.setupMainStream();
    this.multiStream.pipe(this.mainStream);
  }

  createMultiStream(streams, files) {
    // Returning a function makes the stream creation lazy
    let originStreams = [
      ...streams,
      ...files.map(name => () => fs.readStream(name)),
    ];

    let separatedStreams = [];
    for (let stream of originStreams) {
      separatedStreams.push(stream);
      separatedStreams.push(Readable.from("\n"));
    }

    return new MultiStream(separatedStreams);
  }

  setupMainStream() {
    let stream = new LDJSONStream({ objectMode: true });
    stream.on("data", data => {
      this.emit("data", new Record(data));
    });

    stream.on("error", err => {
      console.error(err);
      throw err;
    });

    stream.once("end", () => {
      this.emit("end");
    });

    return stream;
  }

  pipe(...args) {
    this.mainStream.pipe(...args);
  }
}
