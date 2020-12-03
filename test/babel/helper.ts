import { transform, TransformOptions } from "@babel/core";

export function babelTestCode(
  input: string,
  expected: string,
  opts: TransformOptions
): void {
  let { code } = transform(input, opts);
  expect(code).to.equal(expected);
}
