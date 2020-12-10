import { Command, CommandConstructorArgs } from "lib/command";
import Eval from "lib/operations/eval";
import commander from "commander";
import GeneratorStream from "lib/generatorStream";
import SnippetCommand from "lib/snippetCommand";
import logger from "lib/log";

class EvalOutputStream extends GeneratorStream<any, void> {
  async handle(data: any): Promise<void> {
    let type = typeof data;
    if (type === "object") {
      logger.bareLogger(JSON.stringify(data));
    } else {
      logger.bareLogger(data);
    }
  }
}

// TODO: Fix this should be SnippetCommand<Eval>
export default class EvalCommand extends SnippetCommand<Eval> {
  constructor(opts: CommandConstructorArgs, snippet: string) {
    super(opts, snippet);
  }

  createGenerator(errorHandler: (Error) => void): Eval {
    return new Eval({
      code: this.snippet,
      onError: errorHandler,
    });
  }

  async run(): Promise<void> {
    await this.recordGenerator()
      .pipe(this.generator)
      .pipe(new EvalOutputStream())
      .exhaust();
  }

  static setupOptions(command: commander.Command): void {
    command.description(
      "Evaluate the snippet against each record and print the result"
    );
  }

  static filename = __filename;
}

Command.register(EvalCommand, "eval <snippet>");
