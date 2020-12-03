#!/usr/bin/env node

import "./appSetup";

import commander from "commander";
import { Command } from "lib/commands";

const program = new commander.Command();
program.version("0.0.1");

Command.buildProgram(program);

program.parse(process.argv);
