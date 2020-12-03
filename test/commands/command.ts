import Command from "lib/command";
import { runCommand, testifyCommand } from "./helper";
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

  run() {
    this.hasRun = true;
  }
}
Command.register(TestCommand, "test <input> [optional]");

describe("Command", () => {
  it("should initialize a TestCommand", () => {
    const lastCommand = runCommand(
      ["test", "myInput", "myOptional"],
      TestCommand
    );
    expect(lastCommand.input).to.equal("myInput");
    expect(lastCommand.optional).to.equal("myOptional");
    expect(lastCommand.hasRun).to.be.true;
  });

  it("should initialize a TestCommand with extra args", () => {
    const lastCommand = runCommand(
      ["test", "myInput", "myOptional", "extra"],
      TestCommand
    );
    expect(lastCommand.input).to.equal("myInput");
    expect(lastCommand.optional).to.equal("myOptional");
    expect(lastCommand.args).to.deep.equal(["extra"]);
    expect(lastCommand.hasRun).to.be.true;
  });
});
