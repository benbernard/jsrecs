import chai from "chai";
import Record from "../lib/record.js";

export const { expect } = chai;

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
