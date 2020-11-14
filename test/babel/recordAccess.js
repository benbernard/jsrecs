import { expect } from "../testSetup.js";
import recordAccess from "../../lib/babel/recordAccess.js";
import babel from "@babel/core";
import outdent from "outdent";

describe("RecordAccess Plugin", () => {
  it("should transform code", () => {
    testCode('"foo"', '"foo";');
  });

  it("should change unknown access", () => {
    testCode('r.a = "foo"', 'r.data.a = "foo";');
  });

  it("should change not change known access", () => {
    testCode('r.toJSON = "foo"', 'r.toJSON = "foo";');
    testCode('r.data.a = "foo"', 'r.data.a = "foo";');
    testCode(
      "let bar = {a:1}; bar.zip = 3",
      outdent`
        let bar = {
          a: 1
        };
        bar.zip = 3;
      `
    );
  });

  function testCode(input, expected) {
    let { code } = babel.transform(input, { plugins: [recordAccess] });
    expect(code).to.equal(expected);
  }
});
