import Chai from "chai";
import path = require("path");
import streams from "stream";

import Record from "lib/record";
import { projpath } from "lib/appSetup";

export const chai = Chai;

declare global {
  var expect: typeof chai.expect;
}

export const expect = chai.expect;
global.expect = expect;

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

export async function collectStream(
  stream: streams.Stream
): Promise<Array<Record>> {
  return new Promise((resolve, reject) => {
    let arr = [];
    stream.on("data", data => arr.push(data));
    stream.on("end", () => resolve(arr));
  });
}

export function testFile(file: string): string {
  return projpath(path.join("../../test/files", file));
}
