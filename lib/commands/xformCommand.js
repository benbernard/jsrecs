const Command = prequire("lib/command");
const Xform = prequire("lib/operations/xform");
const stream = require("stream");

const XformCommand = (module.exports = class XformCommand extends Command {
  constructor(opts, snippet) {
    super(opts);
    this.snippet = snippet;
    // this.stream = new Xform({ code: snippet });
    this.stream = new stream.Transform({
      objectMode: true,
      transform(data, enc, cb) {
        cb(null, data);
      },
    });

    this.stream.on("end", () => console.log("ending xform operation"));
    this.stream.on("finish", () => {
      console.log("finish xform operation");
    });
  }

  run() {
    this.jsonInputStream().pipe(this.stream).pipe(this.jsonOutputStream());
  }
});

XformCommand.setupOptions = function (command) {
  command.description = "Transform records with a js snippet";
};

Command.register(XformCommand, "xform <snippet>");
