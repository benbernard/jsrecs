#!/usr/bin/env node

require("./appSetup");

const commander = require("commander");

const { Command } = prequire("lib/commands");

const program = new commander.Command();
program.version("0.0.1");

Command.buildProgram(program);

program.parse(process.argv);
