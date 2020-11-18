const { Readable } = require("stream");
const { collectStream } = prequire("test/testSetup");
const { recordStreamFromArgs } = prequire("lib/streamUtils.js");

describe("RecordStream", () => {
  it("should load line-wise records", async () => {
    let streams = [Readable.from(['{"foo": 1}\n{"bar": 2}'])];

    expect(await streamRecordsFromStreams(streams)).to.be.records([
      { foo: 1 },
      { bar: 2 },
    ]);
  });

  it("should take multiple streams", async () => {
    let streams = [
      Readable.from(['{"foo": 1}\n{"bar": 2}\n']),
      Readable.from(['{"zip": "foo"}']),
    ];

    expect(await streamRecordsFromStreams(streams)).to.be.records([
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

    expect(await streamRecordsFromStreams(streams)).to.be.records([
      { foo: 1 },
      { bar: 2 },
      { zip: "foo" },
    ]);
  });

  it("should read from files", async () => {
    expect(
      await streamRecords({ files: ["test/files/simple.recs"] })
    ).to.be.records([{ a: 1 }, { a: 2 }]);
  });
});

function streamRecords(opts) {
  const input = recordStreamFromArgs(opts);
  return collectStream(input);
}

function streamRecordsFromStreams(streams) {
  return streamRecords({ streams });
}
