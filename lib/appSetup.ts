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

export const appRoot = path.resolve(__dirname);

export function projpath(src: string): string {
  return path.join(appRoot, src);
}
