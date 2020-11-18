const { Transform } = require("stream");
const Record = prequire("lib/record");

const RecordStream = (module.exports = class RecordStream extends Transform {
  constructor(opts) {
    super({
      objectMode: true,
      ...opts,
    });
  }

  _transform(obj, encoding, cb) {
    cb(null, new Record(obj));
  }
});
