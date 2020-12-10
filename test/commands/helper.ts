import commander from "commander";
import {
  Command,
  CommandConstructorArgs,
  actionHandlerArgs,
} from "lib/command";
import { GeneratorStream } from "lib/generatorStream";
import Record from "lib/record";
import * as logging from "lib/log";
import { Readable } from "stream";
import { recordGenerator } from "lib/streamUtils";

export async function runCommand(args: string[]): Promise<void> {
  const program = new commander.Command();
  Command.buildProgram(program, true);
  await program.parseAsync(["node", "script", ...args]);
}

export class Result {
  logLines: string[];
  consoleLines: string[];
  bailMessage: string;

  errored = false;
  thrownError: Error;

  constructor() {
    this.reset();
  }

  reset(): void {
    this.logLines = [];
    this.consoleLines = [];
    this.bailMessage = null;
    this.errored = false;
    this.thrownError = null;
  }

  async records(): Promise<Record[]> {
    let generator = recordGenerator({
      streams: this.consoleLines.map(line => Readable.from(line)),
    });

    let records = [];
    for await (let record of generator) {
      records.push(record);
    }

    return records;
  }
}

export function setupCommandTest(): Result {
  let result = new Result();

  before(() => {
    logging.pushLogConfig({
      render(text, { consoleMethod = "" }) {
        result.logLines.push(text);
      },
    });

    logging.pushBareLogger((...args: any[]) => {
      result.consoleLines.push(args.join(" "));
    });

    logging.pushBail(message => {
      result.bailMessage = message;
    });
  });

  beforeEach(() => {
    result.reset();
  });

  after(() => {
    logging.popLog();
    logging.popBareLogger();
    logging.popBail();
  });

  return result;
}
