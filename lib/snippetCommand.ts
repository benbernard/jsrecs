import { Command, CommandConstructorArgs } from "lib/command";
import { ExecutorParseError, ExecutorEvalError } from "lib/executor";
import logger from "lib/log";

export type ErrorHandler = (Error) => void;

export abstract class SnippetCommand<T> extends Command {
  generator: T;
  snippet: string;

  constructor(opts: CommandConstructorArgs, snippet: string) {
    super(opts);
    this.snippet = snippet;

    try {
      this.generator = this.createGenerator(this.onError.bind(this));
    } catch (e) {
      if (e instanceof ExecutorParseError) {
        logger.bail(e.prettyError());
      } else {
        throw e;
      }
    }
  }

  abstract createGenerator(errorHandler: ErrorHandler): T;

  onError(e: Error): void {
    if (e instanceof ExecutorEvalError) {
      logger.log.bright.red.error.noLocate(e.prettyError());
    } else {
      throw e;
    }
  }
}

export default SnippetCommand;
