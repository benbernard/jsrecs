import path from "path";

export const appRoot = path.resolve(__dirname);

export function projpath(src): string {
  return path.join(appRoot, src);
}
