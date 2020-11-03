import LDJSONStream from "ld-jsonstream";
import { Readable } from "stream";
import fs from "fs";
import EventEmitter from "events";
import _ from "../lodash.js";
import Record from "./record.js";

export default class InputStream extends EventEmitter {
  constructor({ files = [], streams = [process.stdin] } = {}) {
    super();

    this.files = files;
    this.streamsAndFiles = [...streams, ...files];

    this.mainStream = this.setupMainStream();
    this.mainStream;
    this.nextStream();
  }

  setupMainStream() {
    let stream = new LDJSONStream({ objectMode: true });
    stream.on("data", (data) => {
      this.emit("data", new Record(data));
    });

    stream.on("error", (err) => {
      console.error(err);
      throw err;
    });

    return stream;
  }

  nextStream() {
    if (this.streamsAndFiles.length === 0) {
      this.emit("end");
      this.mainStream.end();
      return;
    }

    let stream = this.streamsAndFiles.shift();

    // Handle file name case
    if (_.isString(stream)) {
      stream = fs.createReadStream(stream);
    }

    stream.pipe(this.mainStream, { end: false });
    stream.once("end", () => {
      this.nextStream();
    });
  }

  pipe(...args) {
    this.mainStream.pipe(...args);
  }
}
