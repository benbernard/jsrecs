import { expect } from "./testSetup.js";
import InputStream from "../lib/inputStream.js";
import { Readable } from "stream";
import collect from "stream-collect";

describe("Regular records", () => {
  it("should load line-wise records", async () => {
    let input = Readable.from(['{"foo": 1}\n{"bar": 2}']);
    let stream = new InputStream({ streams: [input] });

    expect(await collectInputStream(stream)).to.be.records([
      { foo: 1 },
      { bar: 2 },
    ]);
  });

  it("should take multiple streams", async () => {
    let streams = [
      Readable.from(['{"foo": 1}\n{"bar": 2}\n\n']),
      Readable.from(['{"zip": "foo"}']),
    ];
    let stream = new InputStream({ streams });

    expect(await collectInputStream(stream)).to.be.records([
      { foo: 1 },
      { bar: 2 },
      { zip: "foo" },
    ]);
  });
});

async function collectInputStream(inputStream) {
  return new Promise((resolve, reject) => {
    let arr = [];
    inputStream.on("data", data => arr.push(data));
    inputStream.on("end", () => resolve(arr));
  });
}
