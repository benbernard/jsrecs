const { Writable } = require("stream");

const JSONOutputStream = (module.exports = class JSONOutputStream extends Writable {
  constructor(opts) {
    super({
      objectMode: true,
      ...opts,
    });
  }

  write(obj) {
    console.log(JSON.stringify(obj));
  }
});
