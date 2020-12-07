import { Command, CommandConstructorArgs } from "lib/command";
import Xform from "lib/operations/xform";
import commander from "commander";
import { ExecutorParseError, ExecutorEvalError } from "lib/executor";
import log from "ololog";

export default class XformCommand extends Command {
  generator: Xform;
  snippet: string;

  constructor(opts: CommandConstructorArgs, snippet: string) {
    super(opts);
    this.snippet = snippet;

    try {
      this.generator = new Xform({
        code: snippet,
        onError: e => this.onError(e),
      });
    } catch (e) {
      if (e instanceof ExecutorParseError) {
        this.bail(e.prettyError());
      } else {
        throw e;
      }
    }
  }

  onError(e: Error): void {
    if (e instanceof ExecutorEvalError) {
      log.bright.red.error.noLocate(e.prettyError());
    } else {
      throw e;
    }
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
