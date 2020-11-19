const { recordGenerator, s } = prequire("lib/streamUtils");
const { OutputStream } = prequire("lib/generatorStream");

const Command = (module.exports = class Command {
  constructor({ command, args }) {
    this.cmd = command;
    this.args = args;
  }

  run() {
    throw new Error(`Subclass should implement`);
  }

  recordGenerator() {
    return (this._recordGenerator ??= recordGenerator({
      files: this.args,
    }));
  }

  outputGenerator() {
    return (this._outputGenerator ??= new OutputStream());
  }
});

Command.setupOptions = _.noop;
Command.handleAction = function (...args) {
  let extraArgs = args.pop();
  let command;
  if (_.isArray(extraArgs)) {
    command = args.pop();
  } else {
    command = extraArgs;
    extraArgs = [];
  }

  const instance = new this(
    {
      command,
      args: extraArgs,
    },
    ...args
  );
  instance.run();
  return instance;
};

Command.commands = {};
Command.register = function (subclass, spec, override = false) {
  if (!override && spec in Command.commands) {
    throw new Error(`Already registered class for ${spec}`);
  }

  // Test the prototype, because subclass isn't an instance
  if (!(subclass.prototype instanceof Command)) {
    throw new Error(`Registering command that is not a subclass of Command`);
  }

  subclass.spec = spec;
  Command.commands[spec] = subclass;
};

Command.buildProgram = function (program, trackInstances = false) {
  _.forEach(Command.commands, function (klass, spec) {
    let command = program.command(spec);
    klass.setupOptions(command);
    command.action(function (...args) {
      const instance = klass.handleAction(...args);
      if (trackInstances) program.lastCommandInstance = instance;
    });
  });
};
