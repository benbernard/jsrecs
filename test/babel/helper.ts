const babel = require("@babel/core");

exports.babelTestCode = function testCode(input, expected, opts) {
  let { code } = babel.transform(input, opts);
  expect(code).to.equal(expected);
};
