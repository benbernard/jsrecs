import commander from "commander";
import {
  Command,
  CommandConstructorArgs,
  actionHandlerArgs,
} from "lib/command";
import { GeneratorStream } from "lib/generatorStream";
import Record from "lib/record";

export function runCommand<T extends typeof TestedCommand>(
  args: string[],
  Cmd: T
): InstanceType<T> {
  const program = new commander.Command();
  Command.buildProgram(program, true);
  program.parse(["node", "script", ...args]);
  return Cmd.lastCommand as InstanceType<T>;
}

class CollectingOutputStream extends GeneratorStream<Record, void> {
  records: Record[] = [];

  constructor() {
    super();
  }

  async handle(record): Promise<void> {
    this.records.push(record);
  }
}

class TestedCommand extends Command {
  static lastCommand: TestedCommand;
  donePromise: Promise<Record[]>;
}

export function testifyCommand(klass: typeof Command): typeof TestedCommand {
  const spec = klass.spec;

  class SubClass extends klass {
    static lastCommand: TestedCommand;
    donePromise: Promise<Record[]>;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(...args: any[]) {
      super(args[0], ...args.slice(1));

      this.donePromise = new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });

      SubClass.lastCommand = this;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolve: (any) => any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    reject: (any) => any;

    async run() {
      try {
        await super.run();
        this.resolve(this.outputGenerator().records);
      } catch (err) {
        this.reject(err);
      }
    }

    _outputGenerator: CollectingOutputStream;
    outputGenerator(): CollectingOutputStream {
      return (this._outputGenerator ??= new CollectingOutputStream());
    }
  }

  before(() => {
    Command.register(SubClass, spec, true);
  });

  after(() => {
    Command.register(klass, spec, true);
  });

  return SubClass;
}
