import Command from "../command.js";
import Xform from "../operations/xform.js";
import OutputStream from "../outputStream.js";

export default class XformCommand extends Command {
  constructor(opts, snippet) {
    super(opts);
    this.snippet = snippet;
    this.stream = new Xform({ code: snippet });
  }

  run() {
    this.jsonInputStream().pipe(this.stream).pipe(new OutputStream());
  }
}

XformCommand.setupOptions = function (command) {
  command.description = "Transform records with a js snippet";
};

Command.register(XformCommand, "xform <snippet>");
