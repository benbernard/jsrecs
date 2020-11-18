const commander = require("commander");
const Command = prequire("lib/command");

exports.runCommand = function (args) {
  const program = new commander.Command();
  Command.buildProgram(program, true);
  program.parse(["node", "script", ...args]);

  return program.lastCommandInstance;
};
