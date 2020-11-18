const requireDir = require("require-dir");

const Command = prequire("lib/command");
exports.Command = Command;

const modules = requireDir(__dirname);
exports.commands = _.values(modules);
