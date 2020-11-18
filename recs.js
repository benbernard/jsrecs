#!/usr/bin/env node

require("./appSetup");

const { Command } = require("commander");

const { Command: RecsCommand } = prequire("lib/commands");

const program = new Command();
program.version("0.0.1");

RecsCommand.buildProgram(program);

program.parse(process.argv);
