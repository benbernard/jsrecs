const Command = prequire("lib/command");
const Xform = prequire("lib/operations/xform");
const { pipeline } = prequire("lib/generatorStream");

const XformCommand = (module.exports = class XformCommand extends Command {
  constructor(opts, snippet) {
    super(opts);
    this.snippet = snippet;
    this.generator = new Xform({ code: snippet });
  }

  async run() {
    await pipeline(
      this.recordGenerator(),
      this.generator,
      this.outputGenerator()
    ).exhaust();
  }
});

XformCommand.setupOptions = function (command) {
  command.description = "Transform records with a js snippet";
};

Command.register(XformCommand, "xform <snippet>");
