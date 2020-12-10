import { Command, CommandConstructorArgs } from "lib/command";
import Xform from "lib/operations/xform";
import commander from "commander";
import { ExecutorParseError, ExecutorEvalError } from "lib/executor";
import logger from "lib/log";
import SnippetCommand from "lib/snippetCommand";

export default class XformCommand extends SnippetCommand<Xform> {
  constructor(opts: CommandConstructorArgs, snippet: string) {
    super(opts, snippet);
  }

  createGenerator(errorHandler) {
    return new Xform({
      code: this.snippet,
      onError: errorHandler,
    });
  }

  async run(): Promise<void> {
    await this.recordGenerator()
      .pipe(this.generator)
      .pipe(this.outputGenerator())
      .exhaust();
  }

  static setupOptions(command: commander.Command): void {
    command.description("Transform records with a js snippet");
  }

  static filename = __filename;
}

Command.register(XformCommand, "xform <snippet>");
