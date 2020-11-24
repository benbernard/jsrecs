const Command = prequire("lib/command");
const { runCommand } = require("./helper");

class TestCommand extends Command {
  constructor(opts, input, optional) {
    super(opts);
    this.input = input;
    this.optional = optional;
    this.hasRun = false;
  }

  run() {
    this.hasRun = true;
  }
}
Command.register(TestCommand, "test <input> [optional]");

describe("Command", () => {
  it("should initialize a TestCommand", () => {
    const lastCommand = runCommand(["test", "myInput", "myOptional"]);
    expect(lastCommand.input).to.equal("myInput");
    expect(lastCommand.optional).to.equal("myOptional");
    expect(lastCommand.hasRun).to.be.true;
  });

  it("should initialize a TestCommand with extra args", () => {
    const lastCommand = runCommand(["test", "myInput", "myOptional", "extra"]);
    expect(lastCommand.input).to.equal("myInput");
    expect(lastCommand.optional).to.equal("myOptional");
    expect(lastCommand.args).to.deep.equal(["extra"]);
    expect(lastCommand.hasRun).to.be.true;
  });
});
