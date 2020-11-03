import { expect, collectStream } from "./testSetup.js";
import InputStream from "../lib/inputStream.js";
import { Readable } from "stream";
import collect from "stream-collect";

describe("Regular records", () => {
  it("should load line-wise records", async () => {
    let streams = [Readable.from(['{"foo": 1}\n{"bar": 2}'])];

    expect(await streamRecords(streams)).to.be.records([
      { foo: 1 },
      { bar: 2 },
    ]);
  });

  it("should take multiple streams", async () => {
    let streams = [
      Readable.from(['{"foo": 1}\n{"bar": 2}\n\n']),
      Readable.from(['{"zip": "foo"}']),
    ];

    expect(await streamRecords(streams)).to.be.records([
      { foo: 1 },
      { bar: 2 },
      { zip: "foo" },
    ]);
  });

  it("should allow for multiple streams with no trailing new lines", async () => {
    let streams = [
      Readable.from(['{"foo": 1}\n{"bar": 2}']),
      Readable.from(['{"zip": "foo"}']),
    ];

    expect(await streamRecords(streams)).to.be.records([
      { foo: 1 },
      { bar: 2 },
      { zip: "foo" },
    ]);
  });
});

function streamRecords(streams) {
  const input = new InputStream({ streams });
  return collectStream(input);
}
