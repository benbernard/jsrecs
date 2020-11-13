import { expect, collectStream } from "./testSetup.js";
import { Readable } from "stream";
import collect from "stream-collect";
import { recordStreamFromArgs } from "../lib/streamUtils.js";

describe("RecordStream", () => {
  it("should load line-wise records", async () => {
    let streams = [Readable.from(['{"foo": 1}\n{"bar": 2}'])];

    expect(await streamRecords(streams)).to.be.records([
      { foo: 1 },
      { bar: 2 },
    ]);
  });

  it("should take multiple streams", async () => {
    let streams = [
      Readable.from(['{"foo": 1}\n{"bar": 2}\n']),
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
  const input = recordStreamFromArgs({ streams });
  return collectStream(input);
}
