const commander = require("commander");
const Command = prequire("lib/command");
const stream = require("stream");

exports.runCommand = function (args) {
  const program = new commander.Command();
  Command.buildProgram(program, true);
  program.parse(["node", "script", ...args]);

  return program.lastCommandInstance;
};

exports.testifyCommand = function (klass) {
  const spec = klass.spec;

  class SubClass extends klass {
    jsonOutputStream() {
      const outputRecords = (this.outputRecords = []);

      console.log("setting up test output stream");

      const collectingStream = new stream.Writable({
        objectMode: true,
        write(obj) {
          outputRecords.push(obj);
          console.log("got record");
        },
      });

      this.donePromise = new Promise((resolve, reject) => {
        collectingStream.on("error", reject);
        collectingStream.on("finish", () => {
          console.log("end");
          resolve(outputRecords);
        });
      });

      return collectingStream;
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
