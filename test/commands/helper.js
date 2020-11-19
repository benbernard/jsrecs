const commander = require("commander");
const Command = prequire("lib/command");
const { GeneratorStream } = prequire("lib/generatorStream");

exports.runCommand = function (args) {
  const program = new commander.Command();
  Command.buildProgram(program, true);
  program.parse(["node", "script", ...args]);

  return program.lastCommandInstance;
};

class CollectingOutputStream extends GeneratorStream {
  constructor() {
    super();
    this.records = [];
  }

  handle(record) {
    this.records.push(record);
  }
}

exports.testifyCommand = function (klass) {
  const spec = klass.spec;

  class SubClass extends klass {
    constructor(...args) {
      super(...args);
      this.donePromise = new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    }

    async run(...args) {
      try {
        await super.run(...args);
        this.resolve(this.outputGenerator().records);
      } catch (err) {
        this.reject(err);
      }
    }

    outputGenerator() {
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
};
