import { recordGenerator, s, RecordGeneratorStream } from "lib/streamUtils";
import { OutputStream } from "lib/generatorStream";
import commander from "commander";
import _ from "lib/lod";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type actionHandlerArgs = any[];
export type CommandConstructorArgs = {
  command: commander.Command;
  args: Array<string>;
};

export default class Command {
  cmd: commander.Command;
  args: Array<string>;
  _recordGenerator: RecordGeneratorStream;
  _outputGenerator: OutputStream;

  constructor(
    { command, args }: CommandConstructorArgs,
    ...extra: actionHandlerArgs
  ) {
    this.cmd = command;
    this.args = args;
  }

  async run(): Promise<void> {
    throw new Error(`Subclass should implement`);
  }

  recordGenerator(): RecordGeneratorStream {
    return (this._recordGenerator ??= recordGenerator({
      files: this.args,
    }));
  }

  outputGenerator(): OutputStream {
    return (this._outputGenerator ??= new OutputStream());
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  static setupOptions(command: commander.Command): void {}

  static async handleAction<T extends Command>(
    ...args: actionHandlerArgs
  ): Promise<T> {
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
    await instance.run();
    return instance as T;
  }

  static hasDefaultFilename(): boolean {
    return this.filename === Command.filename;
  }

  static filename: string = __filename;
  static spec = "";
  static commands: Map<string, typeof Command> = new Map();
  static register<T extends Command>(
    subclass: typeof Command,
    spec: string,
    override = false
  ): void {
    if (!override && spec in Command.commands.values()) {
      throw new Error(`Already registered class for ${spec}`);
    }

    // Test the prototype, because subclass isn't an instance
    if (!(subclass.prototype instanceof Command)) {
      throw new Error(`Registering command that is not a subclass of Command`);
    }

    subclass.spec = spec;
    Command.commands.set(spec, subclass);
  }

  static deregister(spec: string | typeof Command): void {
    if (typeof spec === "string") {
      Command.commands.delete(spec);
    } else if (spec instanceof Command) {
      Command.commands.delete(spec.spec);
    }
  }

  static buildProgram(
    program: commander.Command,
    trackInstances = false
  ): void {
    for (let [spec, klass] of Command.commands.entries()) {
      let command = program.command(spec);
      klass.setupOptions(command);
      command.action(async function (...args) {
        const instance = await klass.handleAction(...args);
        if (trackInstances) program.lastCommandInstance = instance;
      });
    }
  }
}

export { Command };
