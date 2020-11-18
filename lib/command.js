import _ from "../lodash.js";
import { recordStreamFromArgs, s } from "./streamUtils.js";
import OutputStream from "./outputStream.js";

export default class Command {
  constructor({ command, args }) {
    this.cmd = command;
    this.args = args;
  }

  run() {
    throw new Error(`Subclass should implement`);
  }

  jsonInputStream() {
    return (this.inputStream ??= recordStreamFromArgs({
      files: this.args,
    }));
  }

  outputStream() {
    return (this.outputStream ??= s(new OutputStream()));
  }
}

Command.commands = {};
Command.register = function (subclass, spec) {
  if (spec in Command.commands) {
    throw new Error(`Already registered class for ${spec}`);
  }

  // Test the prototype, because subclass isn't an instance
  if (!(subclass.prototype instanceof Command)) {
    throw new Error(`Registering command that is not a subclass of Command`);
  }

  subclass.spec = spec;
  Command.commands[spec] = subclass;
};

Command.buildProgram = function (program) {
  _.forEach(Command.commands, function (klass, spec) {
    let command = program.command(spec);
    klass.setupOptions(command);
    command.action(function (...args) {
      const extraArgs = args.pop();
      const command = args.pop();
      const instance = new klass(
        {
          command,
          args: extraArgs,
        },
        ...args
      );
      instance.run();
    });
  });
};
