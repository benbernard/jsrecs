#!/usr/bin/env node

import { Command as RecsCommand } from "./lib/commands/index.js";
import { Command } from "commander";

const program = new Command();
program.version("0.0.1");

RecsCommand.buildProgram(program);

program.parse(process.argv);
