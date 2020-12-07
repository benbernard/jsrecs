import path from "path";

// Initialize tsconfig-paths so that root paths work
// import tsConfigPaths from "tsconfig-paths/register";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const tsConfigPaths = require("tsconfig-paths");

const baseUrl = path.dirname(path.dirname(__filename));

tsConfigPaths.register({
  baseUrl,
  paths: {},
});

// Setup source maps
import "source-map-support/register";

// Better error display
import PrettyError from "pretty-error";
const pe = new PrettyError();
pe.appendStyle({
  "pretty-error > trace": {},
  "pretty-error > trace > item": {
    margin: 0,
  },
});

process.on("uncaughtException", function (error) {
  console.error(pe.render(error));
});

process.on("unhandledRejection", function (error) {
  console.error(pe.render(error));
});

// Better error display
// import ololog from "ololog";
// ololog.handleNodeErrors();

// Helpers for paths
export const appRoot = path.resolve(__dirname);

export function projpath(src: string): string {
  return path.join(appRoot, src);
}
