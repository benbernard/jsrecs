import { Command, CommandConstructorArgs } from "lib/command";
import Xform from "lib/operations/xform";
import commander from "commander";

export default class XformCommand extends Command {
  generator: Xform;
  snippet: string;

  constructor(opts: CommandConstructorArgs, snippet: string) {
    super(opts);
    this.snippet = snippet;
    this.generator = new Xform({ code: snippet });
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
