const Command = prequire("lib/command");
const Xform = prequire("lib/operations/xform");

const XformCommand = (exports.XformCommand = class XformCommand extends Command {
  constructor(opts, snippet) {
    super(opts);
    this.snippet = snippet;
    this.stream = new Xform({ code: snippet });
  }

  run() {
    this.jsonInputStream().pipe(this.stream).pipe(this.jsonOutputStream());
  }
});

XformCommand.setupOptions = function (command) {
  command.description = "Transform records with a js snippet";
};

Command.register(XformCommand, "xform <snippet>");
