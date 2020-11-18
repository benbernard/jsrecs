const outdent = require("outdent");
const recordAccess = prequire("lib/babel/recordAccess");
const { babelTestCode } = require("./helper");

const testCode = function (input, expected) {
  return babelTestCode(input, expected, { plugins: [recordAccess] });
};

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
});
