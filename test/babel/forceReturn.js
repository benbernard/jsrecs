import { expect } from "../testSetup.js";
import forceReturn from "../../lib/babel/forceReturn.js";
import { testCode as babelTestCode } from "./helper.js";
import outdent from "outdent";

const testCode = function (input, expected) {
  return babelTestCode(
    `wrapper = function _jsrecsExecutor(r, LINE, _) { ${input} }`,
    expected,
    { plugins: [forceReturn] }
  );
};

describe("FunctionWrapper Plugin", () => {
  it("should transform an expression", () => {
    testCode(
      "2+2",
      outdent`
      wrapper = function _jsrecsExecutor(r, LINE, _) {
        return 2 + 2;
      };`
    );
  });

  it("should transform a function call", () => {
    testCode(
      "foo()",
      outdent`
      wrapper = function _jsrecsExecutor(r, LINE, _) {
        return foo();
      };`
    );
  });

  it("should transform transform an snippet with a return", () => {
    testCode(
      "if (true) return false; 2 + 2",
      outdent`
      wrapper = function _jsrecsExecutor(r, LINE, _) {
        if (true) return false;
        return 2 + 2;
      };`
    );
  });

  it("should transform not transform an snippet with a final return", () => {
    testCode(
      "return foo()",
      outdent`
      wrapper = function _jsrecsExecutor(r, LINE, _) {
        return foo();
      };`
    );
  });
});
