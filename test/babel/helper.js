import babel from "@babel/core";
import { expect } from "../testSetup.js";

export function testCode(input, expected, opts) {
  let { code } = babel.transform(input, opts);
  expect(code).to.equal(expected);
}
