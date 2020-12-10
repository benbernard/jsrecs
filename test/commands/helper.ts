import commander from "commander";
import {
  Command,
  CommandConstructorArgs,
  actionHandlerArgs,
} from "lib/command";
import { GeneratorStream } from "lib/generatorStream";
import Record from "lib/record";
import logger from "lib/log";
import { Readable } from "stream";
import { recordGenerator } from "lib/streamUtils";

export async function runCommand(args: string[]): Promise<void> {
  const program = new commander.Command();
  Command.buildProgram(program, true);
  await program.parseAsync(["node", "script", ...args]);
}

enum LogLevel {
  Log = "log",
  Warn = "error",
  Error = "warn",
  Debug = "debug",
  Info = "info",
}

export class Result {
  logLines: globalThis.Record<LogLevel, string[]>;
  consoleLines: string[];
  bailMessage: string;

  errored = false;
  thrownError: Error;

  constructor() {
    this.reset();
  }

  reset(): void {
    this.logLines = {
      log: [],
      warn: [],
      error: [],
      debug: [],
      info: [],
    };

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

export class BailError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = this.constructor.name;
  }
}

export function setupCommandTest(): Result {
  let result = new Result();

  before(() => {
    logger.pushAll({
      config: {
        render(
          text: string,
          { consoleMethod = LogLevel.Log }: { consoleMethod: LogLevel }
        ) {
          result.logLines[consoleMethod].push(text);
        },
      },
      bareLogger: (...args: any[]) => {
        result.consoleLines.push(args.join(" "));
      },
      bailHandler: message => {
        result.bailMessage = message;
        throw new BailError(message);
      },
    });
  });

  beforeEach(() => {
    result.reset();
  });

  after(() => {
    logger.popAll();
  });

  return result;
}
