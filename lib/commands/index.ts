import Command from "lib/command";
export { Command };

// Put all exports here
export * from "lib/commands/xformCommand";

// Check all exports
import path from "path";
import fs from "fs";

let filenames = new Set();

// Check that all commands specify a non-default filename
for (let [spec, command] of Command.commands) {
  if (command.hasDefaultFilename()) {
    throw new Error(
      `${command} with spec ${command.spec} has default filename!`
    );
  }

  filenames.add(path.basename(command.filename));
}

// Check that all paths were imported
fs.readdirSync(__dirname).forEach(file => {
  if (file === "index.js") return;
  if (!filenames.has(file)) {
    throw new Error(
      `Could not find ${file} in command registry, did you remember to export it in index.ts?`
    );
  }
});
