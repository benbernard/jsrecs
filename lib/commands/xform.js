import Command from "../command.js";
import { recordStreamFromArgs } from "../streamUtils.js";

export default class XformCommand extends Command {
  constructor(cmd, snippet) {
    super(cmd);
    this.snippet = snippet;
  }

  run() {
    console.log(`snippet: ${this.snippet}`);
    // recordStream.args;
  }
}
Xform.setupOptions = function (command) {
  command.description = "Transform records with a js snippet";
};

Command.register(Xform, "xform <snippet>");
