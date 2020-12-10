import Command from "lib/command";
import { runCommand } from "./helper";
import Record from "lib/record";

class TestCommand extends Command {
  input: string;
  hasRun = false;
  optional?: string;

  static lastCommand: TestCommand;
  donePromise: Promise<Record[]>;

  constructor(opts, input: string, optional: string) {
    super(opts);
    this.input = input;
    this.optional = optional;
    TestCommand.lastCommand = this;
  }

  async run() {
    this.hasRun = true;
  }
}

const spec = "test <input> [optional]";

describe("Command", () => {
  before(() => {
    Command.register(TestCommand, spec);
  });

  it("should initialize a TestCommand", async () => {
    await runCommand(["test", "myInput", "myOptional"]);

    expect(TestCommand.lastCommand.input).to.equal("myInput");
    expect(TestCommand.lastCommand.optional).to.equal("myOptional");
    expect(TestCommand.lastCommand.hasRun).to.be.true;
  });

  it("should initialize a TestCommand with extra args", async () => {
    await runCommand(["test", "myInput", "myOptional", "extra"]);

    expect(TestCommand.lastCommand.input).to.equal("myInput");
    expect(TestCommand.lastCommand.optional).to.equal("myOptional");
    expect(TestCommand.lastCommand.args).to.deep.equal(["extra"]);
    expect(TestCommand.lastCommand.hasRun).to.be.true;
  });

  after(() => {
    Command.deregister(TestCommand);
  });
});
