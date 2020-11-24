const chai = require("chai");
const path = require("path");

const Record = prequire("lib/record");
const { projpath } = prequire("appSetup");

exports.chai = chai;
global.expect = exports.expect = chai.expect;

chai.use((_chai, utils) => {
  const Assertion = chai.Assertion;

  Assertion.addMethod("records", function (records) {
    utils.expectTypes(this, ["array"]);

    let data = [];
    for (let r of this._obj) {
      new Assertion(r).to.be.instanceof(Record);
      data.push(r.data);
    }

    new Assertion(data).to.be.deep.equal(records);
  });
});

exports.collectStream = async function collectStream(stream) {
  return new Promise((resolve, reject) => {
    let arr = [];
    stream.on("data", data => arr.push(data));
    stream.on("end", () => resolve(arr));
  });
};

exports.testFile = function (file) {
  return projpath(path.join("test/files", file));
};
